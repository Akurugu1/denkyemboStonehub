const db = require("../config/dbPromise");


// Save shipping details
const createShipping = async (shippingData) => {

    const {
        orderId,
        recipientName,
        phoneNumber,
        address,
        city,
        region,
        postalCode
    } = shippingData;


    const [result] = await db.query(
        `
        INSERT INTO shipping
        (
            order_id,
            recipient_name,
            phone_number,
            address,
            city,
            region,
            postal_code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            orderId,
            recipientName,
            phoneNumber,
            address,
            city,
            region,
            postalCode
        ]
    );


    return {
        shippingId: result.insertId,
        message: "Shipping details saved successfully."
    };
};



// Get shipping information for an order
const getShippingByOrder = async (orderId) => {


    const [shipping] = await db.query(
        `
        SELECT *
        FROM shipping
        WHERE order_id = ?
        `,
        [orderId]
    );


    return shipping[0];

};



// Update shipping status
const updateShippingStatus = async (
    orderId,
    status
) => {


    await db.query(
        `
        UPDATE shipping
        SET shipping_status = ?
        WHERE order_id = ?
        `,
        [
            status,
            orderId
        ]
    );


    return {
        message:"Shipping status updated successfully."
    };

};



// Delete shipping details
const deleteShipping = async(orderId)=>{


    await db.query(
        `
        DELETE FROM shipping
        WHERE order_id = ?
        `,
        [orderId]
    );


    return {
        message:"Shipping details deleted."
    };

};



module.exports = {

    createShipping,
    getShippingByOrder,
    updateShippingStatus,
    deleteShipping

};
