const orderModel = require("../models/orderModel");


// =====================================================
// GET ALL ORDERS (ADMIN)
// =====================================================

const getAllOrders = async (req, res) => {

    try {

        const orders =
            await orderModel.getAllOrders();


        res.status(200).json({

            totalOrders: orders.length,

            orders

        });

    }

    catch (error) {

        console.error(
            "Get all orders error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving orders.",

            error:
                error.message

        });

    }

};



// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {

    try {

        const {
            orderId
        } = req.params;


        /*
            If this request comes from a customer,
            authenticateCustomer will put the customer's
            ID inside req.user.

            Admin requests can view any order.
        */

        const customerId =
            req.user?.customer_id ||
            req.user?.customerId ||
            null;


        const order =
            await orderModel.getOrderById(
                orderId,
                customerId
            );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found."

            });

        }


        res.status(200).json(order);

    }

    catch (error) {

        console.error(
            "Get order error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving order.",

            error:
                error.message

        });

    }

};



// =====================================================
// UPDATE ORDER STATUS (ADMIN)
// =====================================================

const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const {
            orderId
        } = req.params;


        const {
            status
        } = req.body;


        if (!status) {

            return res.status(400).json({

                message:
                    "Order status is required."

            });

        }


        const allowedStatuses = [

            "Pending",

            "Processing",

            "Shipped",

            "Delivered",

            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid order status."

            });

        }


        const result =
            await orderModel.updateOrderStatus(
                orderId,
                status
            );


        res.status(200).json(result);

    }

    catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        res.status(500).json({

            message:
                "Error updating order status.",

            error:
                error.message

        });

    }

};



// =====================================================
// CREATE ORDER (CUSTOMER)
// =====================================================

const createOrder = async (
    req,
    res
) => {

    try {

        /*
            authenticateCustomer puts the
            customer's JWT information inside:

                req.user
        */

        const customerId =
            req.user?.customer_id ||
            req.user?.customerId;


        if (!customerId) {

            return res.status(401).json({

                message:
                    "Customer authentication information is missing."

            });

        }


        const {
            name,
            phone,
            region,
            address,
            method
        } = req.body;


        // =================================================
        // VALIDATE DELIVERY INFORMATION
        // =================================================

        if (
            !name ||
            !phone ||
            !region ||
            !address ||
            !method
        ) {

            return res.status(400).json({

                message:
                    "All delivery information is required."

            });

        }


        // =================================================
        // VALIDATE DELIVERY METHOD
        // =================================================

        const allowedMethods = [

            "standard",

            "express",

            "pickup"

        ];


        if (
            !allowedMethods.includes(method)
        ) {

            return res.status(400).json({

                message:
                    "Invalid delivery method."

            });

        }


        // =================================================
        // CREATE ORDER
        // =================================================

        const order =
            await orderModel.createOrder(

                customerId,

                {
                    name,
                    phone,
                    region,
                    address,
                    method
                }

            );


        // =================================================
        // SEND RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Order created successfully.",

            order

        });

    }

    catch (error) {

        console.error(
            "Create order error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Unable to create order."

        });

    }

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllOrders,

    getOrderById,

    updateOrderStatus,

    createOrder

};