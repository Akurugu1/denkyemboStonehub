const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");


// Create payment
router.post(
    "/",
    paymentController.createPayment
);


// Get payment by order ID
router.get(
    "/order/:orderId",
    paymentController.getPaymentByOrder
);


// Update payment status
router.put(
    "/status/:paymentId",
    paymentController.updatePaymentStatus
);


// Validate payment transaction
router.post(
    "/validate/:paymentId",
    paymentController.validatePayment
);


module.exports = router;
