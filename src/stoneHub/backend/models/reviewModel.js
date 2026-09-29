const db = require("../config/db");


const getAllReviews = (callback) => {

    const sql = `
        SELECT
            r.review_id,
            r.customer_id,
            r.product_id,
            r.rating,
            r.review_text,
            r.date_created,
            r.status,

            CONCAT(
                c.first_name,
                ' ',
                c.last_name
            ) AS customer_name,

            p.product_name

        FROM reviews r

        JOIN customers c
            ON r.customer_id = c.customer_id

        JOIN product p
            ON r.product_id = p.product_id

        ORDER BY r.date_created DESC
    `;


    db.query(sql, callback);

};

const updateReviewStatus = (id, status, callback) => {

    const sql = `
        UPDATE reviews
        SET status = ?
        WHERE review_id = ?
    `;

    db.query(
        sql,
        [status, id],
        callback
    );

};


const deleteReview = (id, callback) => {

    const sql = `
        DELETE FROM reviews
        WHERE review_id = ?
    `;

    db.query(
        sql,
        [id],
        callback
    );

};


module.exports = {
    getAllReviews,
    updateReviewStatus,
    deleteReview
};