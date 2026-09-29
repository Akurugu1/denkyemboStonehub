const express = require("express");
const router = express.Router();

const shippingController = require("../controllers/shippingController");


// Save shipping details
router.post(
    "/",
    shippingController.createShipping
);


// Get shipping details using order ID
router.get(
    "/order/:orderId",
    shippingController.getShippingByOrder
);


// Update shipping status
router.put(
    "/status/:orderId",
    shippingController.updateShippingStatus
);


// Delete shipping details
router.delete(
    "/:orderId",
    shippingController.deleteShipping
);


module.exports = router;
