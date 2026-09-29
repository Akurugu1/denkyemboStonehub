const db = require("../config/dbPromise");


// Save payment record
const createPayment = async (paymentData) => {

    const {
        orderId,
        paymentMethod,
        amount
    } = paymentData;


    const paymentStatus = "Pending";


    const [result] = await db.query(
        `
        INSERT INTO payment
        (
            order_id,
            payment_method,
            payment_status,
            amount
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            orderId,
            paymentMethod,
            paymentStatus,
            amount
        ]
    );


    return {
        paymentId: result.insertId,
        message: "Payment record created successfully."
    };

};





// Get payment by order ID
const getPaymentByOrder = async(orderId)=>{


    const [payment] = await db.query(
        `
        SELECT *
        FROM payment
        WHERE order_id = ?
        `,
        [orderId]
    );


    return payment[0];

};





// Update payment status after validation
const updatePaymentStatus = async(
    paymentId,
    status
)=>{


    await db.query(
        `
        UPDATE payment
        SET payment_status = ?
        WHERE payment_id = ?
        `,
        [
            status,
            paymentId
        ]
    );


    return {
        message:"Payment status updated successfully."
    };

};





// Validate payment transaction
const validatePayment = async(paymentId)=>{


    const [payment] = await db.query(
        `
        SELECT *
        FROM payment
        WHERE payment_id = ?
        `,
        [paymentId]
    );


    if(payment.length === 0){

        return {
            valid:false,
            message:"Payment record not found."
        };

    }



    if(payment[0].payment_status === "Paid"){

        return {
            valid:true,
            message:"Transaction already completed."
        };

    }



    return {
        valid:true,
        message:"Transaction is valid and pending confirmation."
    };


};





module.exports = {

    createPayment,
    getPaymentByOrder,
    updatePaymentStatus,
    validatePayment

};
