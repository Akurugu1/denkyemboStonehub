const adminPaymentModel = require("../models/adminpaymentModel");


// Get all payments
const getAllPayments = (req, res) => {

    adminPaymentModel.getAllPayments((err, payments) => {

        if (err) {

            console.error("Error fetching payments:", err);

            return res.status(500).json({
                message: "Failed to fetch payments"
            });

        }


        res.status(200).json(payments);

    });

};


module.exports = {
    getAllPayments
};