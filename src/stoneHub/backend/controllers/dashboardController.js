const dashboardModel = require("../models/dashboardModel");

function getDashboardStats(req, res) {

    dashboardModel.getDashboardStats((err, stats) => {

        if (err) {

            console.error("Dashboard stats error:", err);

            return res.status(500).json({
                message: "Failed to load dashboard statistics"
            });
        }

        res.json(stats);
    });
}

function getSalesData(req, res) {

    dashboardModel.getSalesData((err, sales) => {

        if (err) {

            console.error("Sales data error:", err);

            return res.status(500).json({
                message: "Failed to load sales data"
            });
        }

        res.json(sales);
    });
}

function getRecentOrders(req, res) {

    dashboardModel.getRecentOrders((err, orders) => {

        if (err) {

            console.error("Recent orders error:", err);

            return res.status(500).json({
                message: "Failed to load recent orders"
            });
        }

        res.json(orders);
    });
}

function getRecentCustomers(req, res) {

    dashboardModel.getRecentCustomers((err, customers) => {

        if (err) {

            console.error("Recent customers error:", err);

            return res.status(500).json({
                message: "Failed to load recent customers"
            });
        }

        res.json(customers);
    });
}

function getLowStockProducts(req, res) {

    dashboardModel.getLowStockProducts((err, products) => {

        if (err) {

            console.error("Low stock error:", err);

            return res.status(500).json({
                message: "Failed to load low stock products"
            });
        }

        res.json(products);
    });
}

module.exports = {
    getDashboardStats,
    getSalesData,
    getRecentOrders,
    getRecentCustomers,
    getLowStockProducts
};