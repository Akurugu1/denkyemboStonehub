const db =
    require("../config/dbPromise");

const paymentModel =
    require("../models/paymentModel");

const orderModel =
    require("../models/orderModel");

const generateInvoicePDF =
    require("../utils/invoiceGenerator");

const invoiceModel =
    require("../models/invoiceModel");

const { sendEmail } =
    require("../utils/emailService");

// Create payment record
const createPayment = async (req, res) => {

    try {

        const {
            orderId,
            paymentMethod,
            amount
        } = req.body;


        // Validate required fields
        if (
            !orderId ||
            !paymentMethod ||
            !amount
        ) {

            return res.status(400).json({
                message: "Order ID, payment method and amount are required."
            });

        }



        // Allow only supported payment methods
        const allowedMethods = [
            "Cash",
            "Mobile Money",
            "Bank Transfer"
        ];


        if (!allowedMethods.includes(paymentMethod)) {

            return res.status(400).json({
                message: "Invalid payment method."
            });

        }



        const result = await paymentModel.createPayment({
            orderId,
            paymentMethod,
            amount
        });



        res.status(201).json(result);



    } catch(error) {


        console.error(error);


        res.status(500).json({
            message:"Error processing payment.",
            error:error.message
        });


    }

};





// Get payment information using order ID
const getPaymentByOrder = async(req,res)=>{


    try{


        const {orderId} = req.params;


        const payment =
        await paymentModel.getPaymentByOrder(orderId);



        if(!payment){

            return res.status(404).json({
                message:"Payment record not found."
            });

        }



        res.status(200).json(payment);



    }catch(error){


        console.error(error);


        res.status(500).json({
            message:"Error retrieving payment.",
            error:error.message
        });


    }

};






// Update payment status
const updatePaymentStatus = async (req, res) => {

    try {

        const { paymentId } =
            req.params;

        const { status } =
            req.body;


        const validStatuses = [
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ];


        if (!validStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid payment status."
            });

        }


        // Update payment
        const result =
            await paymentModel.updatePaymentStatus(
                paymentId,
                status
            );


        // =================================================
        // IF PAYMENT IS SUCCESSFUL
        // =================================================

        if (status === "Paid") {

    let invoiceId = null;

    try {

        // =============================================
        // 1. GET PAYMENT INFORMATION
        // =============================================

        const [payment] =
            await db.query(
                `
                SELECT *
                FROM payment
                WHERE payment_id = ?
                `,
                [paymentId]
            );


        if (payment.length === 0) {

            return res.status(404).json({
                message: "Payment not found."
            });

        }


        const paymentRecord =
            payment[0];


        // =============================================
        // 2. GET ORDER INFORMATION
        // =============================================

        const order =
            await orderModel.getOrderById(
                paymentRecord.order_id
            );


        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }


        // =============================================
        // 3. CREATE INVOICE RECORD
        // =============================================

        invoiceId =
            await invoiceModel.createInvoice(

                order.order_id,

                paymentId,

                `invoice_${order.order_id}.pdf`

            );


        // =============================================
        // 4. GENERATE PDF
        // =============================================

        const invoiceFile =
            await generateInvoicePDF({

                orderId:
                    order.order_id,

                customerName:
                    order.customer_name,

                email:
                    order.customer_email,

                paymentMethod:
                    paymentRecord.payment_method,

                items:
                    order.items.map(item => ({

                        product_name:
                            item.name,

                        quantity:
                            item.quantity,

                        price:
                            item.price

                    })),

                totalAmount:
                    order.total_amount

            });


        // =============================================
        // 5. SEND EMAIL
        // =============================================

        await sendEmail({

            from:
                `"StoneHub" <${process.env.EMAIL_USER}>`,

            to:
                order.customer_email,

            subject:
                "StoneHub Payment Invoice",

            text:
                `Thank you for your purchase.

Your StoneHub invoice for Order #${order.order_id} is attached.`,

            attachments: [

                {

                    filename:
                        `StoneHub-Invoice-${order.order_id}.pdf`,

                    path:
                        invoiceFile

                }

            ]

        });


        // =============================================
        // 6. MARK INVOICE AS SENT
        // =============================================

        await invoiceModel.markInvoiceSent(
            invoiceId
        );


        console.log(
            `Invoice ${invoiceId} sent successfully.`
        );


    } catch (invoiceError) {

        console.error(
            "Invoice processing failed:",
            invoiceError
        );


        // =============================================
        // 7. RECORD FAILURE
        // =============================================

        if (invoiceId) {

            try {

                await invoiceModel.markInvoiceFailed(

                    invoiceId,

                    invoiceError.message

                );

            } catch (recordError) {

                console.error(
                    "Could not record invoice failure:",
                    recordError
                );

            }

        }


        return res.status(500).json({

            message:
                "Payment was successful, but invoice processing failed."

        });

    }

}


        res.status(200).json({

            message:
                status === "Paid"
                    ? "Payment updated and invoice sent successfully."
                    : "Payment status updated successfully."

        });


    } catch (error) {

        console.error(
            "Payment/invoice error:",
            error
        );


        res.status(500).json({

            message:
                "Payment status was updated, but invoice processing failed."

        });

    }

};




// Validate transaction
const validatePayment = async(req,res)=>{


    try{


        const {paymentId} = req.params;



        const result =
        await paymentModel.validatePayment(paymentId);



        res.status(200).json(result);



    }catch(error){


        console.error(error);


        res.status(500).json({
            message:"Error validating transaction.",
            error:error.message
        });


    }

};





module.exports = {

    createPayment,
    getPaymentByOrder,
    updatePaymentStatus,
    validatePayment

};
