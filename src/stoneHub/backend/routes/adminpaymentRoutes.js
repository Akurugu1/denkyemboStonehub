const express = require("express");

const router = express.Router();

const adminPaymentController =
    require("../controllers/adminpaymentController");


// Get all payments
router.get(
    "/",
    adminPaymentController.getAllPayments
);


module.exports = router;