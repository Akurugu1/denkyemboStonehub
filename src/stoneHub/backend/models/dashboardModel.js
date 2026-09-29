const db = require("../config/db");

function getDashboardStats(callback) {

    const query = `
        SELECT
            (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS sales,
            (SELECT COUNT(*) FROM orders) AS orders,
            (SELECT COUNT(*) FROM customers) AS customers,
            (SELECT COUNT(*) FROM product) AS products
    `;

    db.query(query, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results[0]);
    });
}


function getSalesData(callback) {

    const query = `
        SELECT
            DATE(order_date) AS sale_date,
            SUM(total_amount) AS total_sales
        FROM orders
        GROUP BY DATE(order_date)
        ORDER BY DATE(order_date)
    `;

    db.query(query, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
}

function getRecentOrders(callback) {

    const query = `
        SELECT
            o.order_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            o.total_amount,
            o.order_status
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.customer_id
        ORDER BY o.order_date DESC
        LIMIT 5
    `;

    db.query(query, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
}

function getRecentCustomers(callback) {

    const query = `
        SELECT
            first_name,
            last_name,
            email
        FROM customers
        ORDER BY date_created DESC
        LIMIT 5
    `;

    db.query(query, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
}

function getLowStockProducts(callback) {

    const query = `
        SELECT
            product_name,
            stock_quantity
        FROM product
        WHERE stock_quantity <= 5
        ORDER BY stock_quantity ASC
    `;

    db.query(query, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
}


module.exports = {
    getDashboardStats,
    getSalesData,
    getRecentOrders,
    getRecentCustomers,
    getLowStockProducts
};