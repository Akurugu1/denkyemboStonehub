const db = require("../config/dbPromise");


/* ==========================================================
   CREATE QUOTE REQUEST
========================================================== */

const createQuoteRequest = async (
    productId,
    fullName,
    email,
    phoneNumber,
    quantity,
    message
) => {

    const sql = `
        INSERT INTO quote_requests
        (
            product_id,
            full_name,
            email,
            phone_number,
            quantity,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(
        sql,
        [
            productId,
            fullName,
            email,
            phoneNumber,
            quantity,
            message
        ]
    );

    return result;
};


/* ==========================================================
   GET ALL QUOTE REQUESTS
========================================================== */

const getAllQuoteRequests = async () => {

    const sql = `
        SELECT
            qr.*,
            p.product_name
        FROM quote_requests qr
        JOIN product p
            ON qr.product_id = p.product_id
        ORDER BY qr.date_created DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
};


/* ==========================================================
   EXPORT FUNCTIONS
========================================================== */

module.exports = {
    createQuoteRequest,
    getAllQuoteRequests
};