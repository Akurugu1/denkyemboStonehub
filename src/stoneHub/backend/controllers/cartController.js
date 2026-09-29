const cartModel = require("../models/cartModel");


// ==========================================================
// ADD PRODUCT TO CART
// ==========================================================

const addToCart = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;

        const {
            productId,
            quantity
        } = req.body;


        if (!productId || !quantity) {

            return res.status(400).json({
                message:
                    "Product ID and quantity are required."
            });

        }


        if (quantity <= 0) {

            return res.status(400).json({
                message:
                    "Quantity must be greater than zero."
            });

        }


        const result =
            await cartModel.addToCart(
                customerId,
                productId,
                quantity
            );


        res.status(201).json(result);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error adding product to cart.",
            error: error.message
        });

    }

};



// ==========================================================
// REMOVE PRODUCT FROM CART
// ==========================================================

const removeFromCart = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;

        const {
            productId
        } = req.body;


        if (!productId) {

            return res.status(400).json({
                message:
                    "Product ID is required."
            });

        }


        const result =
            await cartModel.removeFromCart(
                customerId,
                productId
            );


        res.status(200).json(result);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error removing product from cart.",
            error: error.message
        });

    }

};



// ==========================================================
// UPDATE QUANTITY
// ==========================================================

const updateQuantity = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;

        const {
            productId,
            quantity
        } = req.body;


        if (!productId || quantity === undefined) {

            return res.status(400).json({
                message:
                    "Product ID and quantity are required."
            });

        }


        if (quantity <= 0) {

            return res.status(400).json({
                message:
                    "Quantity must be greater than zero."
            });

        }


        const result =
            await cartModel.updateQuantity(
                customerId,
                productId,
                quantity
            );


        res.status(200).json(result);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error updating quantity.",
            error: error.message
        });

    }

};



// ==========================================================
// VIEW CART
// ==========================================================

const viewCart = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;


        const cartItems =
            await cartModel.viewCart(
                customerId
            );


        res.status(200).json({
            customerId,
            items: cartItems
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error retrieving cart.",
            error: error.message
        });

    }

};



// ==========================================================
// CALCULATE CART TOTAL
// ==========================================================

const calculateTotals = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;


        const total =
            await cartModel.calculateTotals(
                customerId
            );


        res.status(200).json({
            customerId,
            totalAmount: total.total
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error calculating cart total.",
            error: error.message
        });

    }

};



// ==========================================================
// CLEAR CART
// ==========================================================

const clearCart = async (req, res) => {

    try {

        const customerId =
            req.user.customer_id;


        await cartModel.clearCart(
            customerId
        );


        res.status(200).json({
            message:
                "Cart cleared successfully."
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error clearing cart.",
            error: error.message
        });

    }

};



module.exports = {

    addToCart,
    removeFromCart,
    updateQuantity,
    viewCart,
    calculateTotals,
    clearCart

};