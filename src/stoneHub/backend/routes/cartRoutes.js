const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cartController");

const { authenticateCustomer } =
    require("../middleware/authMiddleware");


// ==========================================================
// ADD PRODUCT TO CART
// ==========================================================

router.post(
    "/add",
    authenticateCustomer,
    cartController.addToCart
);


// ==========================================================
// REMOVE PRODUCT FROM CART
// ==========================================================

router.delete(
    "/remove",
    authenticateCustomer,
    cartController.removeFromCart
);


// ==========================================================
// UPDATE QUANTITY
// ==========================================================

router.put(
    "/update",
    authenticateCustomer,
    cartController.updateQuantity
);


// ==========================================================
// VIEW CART
// ==========================================================

router.get(
    "/",
    authenticateCustomer,
    cartController.viewCart
);


// ==========================================================
// CALCULATE TOTAL
// ==========================================================

router.get(
    "/total",
    authenticateCustomer,
    cartController.calculateTotals
);


// ==========================================================
// CLEAR CART
// ==========================================================

router.delete(
    "/clear",
    authenticateCustomer,
    cartController.clearCart
);


module.exports = router;