const generateInvoicePDF =
    require("../utils/invoiceGenerator");

const { sendEmail } =
    require("../utils/emailService");

const orderModel =
    require("../models/orderModel");

const paymentModel =
    require("../models/paymentModel");

const invoiceModel =
    require("../models/invoiceModel");


// =====================================================
// SEND INVOICE
// =====================================================

const sendInvoice = async (req, res) => {

    try {

        const {
            orderId,
            paymentMethod
        } = req.body;


        if (!orderId) {

            return res.status(400).json({
                message: "Order ID is required."
            });

        }


        // Get complete order information
        const order =
            await orderModel.getOrderById(orderId);


        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }


        // =================================================
        // GENERATE PDF
        // =================================================

        const invoiceFile =
            await generateInvoicePDF({

                orderId: order.order_id,

                customerName:
                    order.customer_name,

                email:
                    order.customer_email,

                paymentMethod:
                    paymentMethod || "Mobile Money",

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


        // =================================================
        // SEND EMAIL
        // =================================================

        await sendEmail({

            from:
                `"StoneHub" <${process.env.EMAIL_USER}>`,

            to:
                order.customer_email,

            subject:
                "StoneHub Payment Invoice",

            text:
                `Thank you for your purchase.

Your StoneHub invoice for Order #${order.order_id} is attached.

Total Amount: GHS ${Number(
                order.total_amount
            ).toFixed(2)}

Thank you for shopping with StoneHub.`,

            attachments: [

                {
                    filename:
                        `StoneHub-Invoice-${order.order_id}.pdf`,

                    path:
                        invoiceFile

                }

            ]

        });


        // =================================================
        // SUCCESS
        // =================================================

        res.status(200).json({

            message:
                "Invoice generated and sent successfully.",

            orderId:
                order.order_id,

            email:
                order.customer_email

        });


    } catch (error) {

        console.error(
            "Invoice error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to generate or send invoice."

        });

    }

};


module.exports = {

    sendInvoice

};