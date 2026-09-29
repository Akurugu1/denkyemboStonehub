const express = require("express");

const router = express.Router();


const trackingController =
require("../controllers/trackingController");



// Create initial tracking record
router.post(
    "/",
    trackingController.createTracking
);



// Get order tracking history
router.get(
    "/order/:orderId",
    trackingController.getTrackingByOrder
);



// Update order status
router.put(
    "/status/:orderId",
    trackingController.updateTrackingStatus
);



module.exports = router;
