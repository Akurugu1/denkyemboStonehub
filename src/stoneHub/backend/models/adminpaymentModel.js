const db = require("../config/db");


// Get all payments for the admin dashboard
const getAllPayments = (callback) => {

    const sql = `
        SELECT
            p.payment_id,
            p.order_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer,
            p.amount,
            p.payment_method,
            o.order_date,
            p.payment_status
        FROM payment p
        JOIN orders o
            ON p.order_id = o.order_id
        JOIN customers c
            ON o.customer_id = c.customer_id
        ORDER BY p.payment_id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            return callback(err, null);

        }


        callback(null, results);

    });

};


module.exports = {
    getAllPayments
};