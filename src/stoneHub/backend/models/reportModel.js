const db = require("../config/db");


const getReportSummary = (days, callback) => {

    const sql = `
        SELECT

            (
                SELECT COALESCE(SUM(p.amount), 0)
                FROM payment p
                JOIN orders o
                    ON p.order_id = o.order_id
                WHERE p.payment_status = 'Paid'
                AND o.order_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
            ) AS totalRevenue,

            COUNT(DISTINCT o.order_id) AS totalOrders,

            COUNT(DISTINCT o.customer_id) AS totalCustomers,

            COALESCE(AVG(o.total_amount), 0) AS averageOrder

        FROM orders o

        WHERE o.order_date >=
            DATE_SUB(NOW(), INTERVAL ? DAY)
    `;


    db.query(
        sql,
        [days, days],
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results[0]);

        }
    );

};    


const getCustomerOverview = (days, callback) => {

    const sql = `
        SELECT

            (
                SELECT COUNT(*)
                FROM customers c
                WHERE c.date_created >=
                    DATE_SUB(NOW(), INTERVAL ? DAY)
            ) AS newCustomers,


            (
                SELECT COUNT(DISTINCT o.customer_id)
                FROM orders o
                WHERE o.order_date >=
                    DATE_SUB(NOW(), INTERVAL ? DAY)

                AND EXISTS (

                    SELECT 1
                    FROM orders previous_order
                    WHERE previous_order.customer_id = o.customer_id
                    AND previous_order.order_date <
                        DATE_SUB(NOW(), INTERVAL ? DAY)

                )
            ) AS returningCustomers,


            (
                SELECT COUNT(DISTINCT o.customer_id)
                FROM orders o
                WHERE o.order_date >=
                    DATE_SUB(NOW(), INTERVAL ? DAY)
            ) AS activeCustomers,


            (
                SELECT COUNT(*)
                FROM customers c
                WHERE NOT EXISTS (

                    SELECT 1
                    FROM orders o
                    WHERE o.customer_id = c.customer_id
                    AND o.order_date >=
                        DATE_SUB(NOW(), INTERVAL ? DAY)

                )
            ) AS inactiveCustomers
    `;


    db.query(
        sql,
        [
            days,
            days,
            days,
            days,
            days
        ],
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results[0]);

        }
    );

};

// =====================================================
// GET ORDER STATUS
// =====================================================

const getOrderStatus = (days, callback) => {

    const sql = `
        SELECT
            o.order_status AS status,
            COUNT(*) AS count

        FROM orders o

        WHERE o.order_date >=
            DATE_SUB(NOW(), INTERVAL ? DAY)

        GROUP BY o.order_status

        ORDER BY count DESC
    `;


    db.query(
        sql,
        [days],
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results);

        }
    );

};

// =====================================================
// GET TOP PRODUCTS
// =====================================================

const getTopProducts = (days, callback) => {

    const sql = `
        SELECT

            p.product_name AS name,

            SUM(oi.quantity) AS sales,

            SUM(
                oi.quantity * oi.unit_price
            ) AS revenue

        FROM order_item oi

        JOIN product p
            ON oi.product_id = p.product_id

        JOIN orders o
            ON oi.order_id = o.order_id

        WHERE o.order_date >=
            DATE_SUB(NOW(), INTERVAL ? DAY)

        GROUP BY
            p.product_id,
            p.product_name

        ORDER BY
            sales DESC

        LIMIT 5
    `;


    db.query(
        sql,
        [days],
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results);

        }
    );

};


// =====================================================
// GET SALES OVERVIEW
// =====================================================

const getSalesOverview = (days, callback) => {

    const sql = `
        SELECT

            DATE(o.order_date) AS date,

            COALESCE(
                SUM(
                    CASE
                        WHEN p.payment_status = 'Paid'
                        THEN p.amount
                        ELSE 0
                    END
                ),
                0
            ) AS revenue

        FROM orders o

        LEFT JOIN payment p
            ON o.order_id = p.order_id

        WHERE o.order_date >=
            DATE_SUB(NOW(), INTERVAL ? DAY)

        GROUP BY DATE(o.order_date)

        ORDER BY DATE(o.order_date) ASC
    `;


    db.query(
        sql,
        [days],
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results);

        }
    );

};

module.exports = {
    getReportSummary,
    getCustomerOverview,
    getOrderStatus,
    getTopProducts,
    getSalesOverview
};


