const reportModel = require("../models/reportModel");

const getReportSummary = (req, res) => {

    const days =
        Number(req.query.days) || 30;


    reportModel.getReportSummary(
        days,
        (err, summary) => {

            if (err) {

                console.error(
                    "Error fetching report summary:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch report summary"
                });

            }


            res.status(200).json(summary);

        }
    );

};


const getCustomerOverview = (req, res) => {

    const days =
        Number(req.query.days) || 30;


    reportModel.getCustomerOverview(
        days,
        (err, overview) => {

            if (err) {

                console.error(
                    "Error fetching customer overview:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch customer overview"
                });

            }


            res.status(200).json(overview);

        }
    );
};


// =====================================================
// GET ORDER STATUS
// =====================================================

const getOrderStatus = (req, res) => {

    const days =
        Number(req.query.days) || 30;


    reportModel.getOrderStatus(
        days,
        (err, orderStatus) => {

            if (err) {

                console.error(
                    "Error fetching order status:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch order status"
                });

            }


            res.status(200).json(orderStatus);

        }
    );

};

// =====================================================
// GET TOP PRODUCTS
// =====================================================

const getTopProducts = (req, res) => {

    const days =
        Number(req.query.days) || 30;


    reportModel.getTopProducts(
        days,
        (err, products) => {

            if (err) {

                console.error(
                    "Error fetching top products:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch top products"
                });

            }


            res.status(200).json(products);

        }
    );

};

// =====================================================
// GET SALES OVERVIEW
// =====================================================

const getSalesOverview = (req, res) => {

    const days =
        Number(req.query.days) || 30;


    reportModel.getSalesOverview(
        days,
        (err, salesData) => {

            if (err) {

                console.error(
                    "Error fetching sales overview:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch sales overview"
                });

            }


            res.status(200).json(salesData);

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