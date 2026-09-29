const db = require("../config/dbPromise");



// Create tracking record
const createTracking = async(trackingData)=>{


    const {
        orderId,
        status,
        location
    } = trackingData;



    const [result] = await db.query(

        `
        INSERT INTO order_tracking
        (
            order_id,
            status,
            location
        )

        VALUES (?, ?, ?)

        `,

        [
            orderId,
            status,
            location
        ]

    );


    return {

        trackingId: result.insertId,

        message:"Order tracking created successfully."

    };

};





// Get current order tracking
const getTrackingByOrder = async(orderId)=>{


    const [tracking] = await db.query(

        `
        SELECT *

        FROM order_tracking

        WHERE order_id = ?

        ORDER BY updated_at DESC

        `,

        [
            orderId
        ]

    );


    return tracking;

};






// Update order status
const updateTrackingStatus = async(
    orderId,
    status,
    location
)=>{


    // Update orders table

    await db.query(

        `
        UPDATE orders

        SET order_status = ?

        WHERE order_id = ?

        `,

        [
            status,
            orderId
        ]

    );



    // Add tracking history

    await db.query(

        `
        INSERT INTO order_tracking

        (
            order_id,
            status,
            location
        )

        VALUES (?, ?, ?)

        `,

        [
            orderId,
            status,
            location
        ]

    );



    return {

        message:"Order status updated successfully."

    };

};






module.exports = {

    createTracking,

    getTrackingByOrder,

    updateTrackingStatus

};
