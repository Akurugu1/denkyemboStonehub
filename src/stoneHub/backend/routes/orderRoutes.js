const express = require("express");

const router = express.Router();

const orderController =
    require("../controllers/orderController");

const {
    authenticateCustomer,
    authenticateAdmin
} = require("../middleware/authMiddleware");


// =====================================================
// CUSTOMER CREATE ORDER
// =====================================================

router.post(
    "/",
    authenticateCustomer,
    orderController.createOrder
);


// =====================================================
// CUSTOMER TRACK / VIEW OWN ORDER
// =====================================================

router.get(
    "/:orderId",
    authenticateCustomer,
    orderController.getOrderById
);


// =====================================================
// ADMIN VIEW ALL ORDERS
// =====================================================

router.get(
    "/",
    authenticateAdmin,
    orderController.getAllOrders
);


// =====================================================
// ADMIN UPDATE ORDER STATUS
// =====================================================

router.put(
    "/status/:orderId",
    authenticateAdmin,
    orderController.updateOrderStatus
);


module.exports = router;