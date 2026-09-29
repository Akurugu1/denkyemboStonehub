const db = require("../config/dbPromise");


// =====================================================
// GET ALL ORDERS (ADMIN)
// =====================================================

const getAllOrders = async () => {

    const sql = `
        SELECT 
            o.order_id,
            o.customer_id,
            o.order_date,
            o.total_amount,
            o.order_status,
            CONCAT(
                c.first_name,
                ' ',
                c.last_name
            ) AS customer_name

        FROM orders o

        JOIN customers c
            ON o.customer_id = c.customer_id

        ORDER BY o.order_date DESC
    `;

    const [results] = await db.query(sql);

    return results;
};


// =====================================================
// GET SINGLE ORDER WITH ITEMS
// =====================================================
// Admin can view any order.
// Customer access is controlled by customerId.
// =====================================================

const getOrderById = async (
    orderId,
    customerId = null
) => {

    let orderSql = `
        SELECT
            o.order_id,
            o.customer_id,
            o.order_date,
            o.total_amount,
            o.order_status,

            CONCAT(
                c.first_name,
                ' ',
                c.last_name
            ) AS customer_name,

            c.email AS customer_email

        FROM orders o

        JOIN customers c
            ON o.customer_id = c.customer_id

        WHERE o.order_id = ?
    `;


    const queryParams = [orderId];


    // If customerId is provided,
    // make sure the order belongs to that customer.

    if (customerId !== null) {

        orderSql += `
            AND o.customer_id = ?
        `;

        queryParams.push(customerId);

    }


    const [orderResults] =
        await db.query(
            orderSql,
            queryParams
        );


    // Order doesn't exist
    // OR order doesn't belong to customer

    if (orderResults.length === 0) {

        return null;

    }


    const order =
        orderResults[0];


    // =================================================
    // GET ORDER ITEMS
    // =================================================

    const itemsSql = `
        SELECT
            oi.order_item_id,
            oi.product_id,
            p.product_name AS name,
            oi.quantity,
            oi.unit_price AS price

        FROM order_item oi

        JOIN product p
            ON oi.product_id = p.product_id

        WHERE oi.order_id = ?

        ORDER BY oi.order_item_id
    `;


    const [itemResults] =
        await db.query(
            itemsSql,
            [orderId]
        );


    order.items =
        itemResults;


    return order;

};


// =====================================================
// UPDATE ORDER STATUS (ADMIN)
// =====================================================

const updateOrderStatus = async (
    orderId,
    status
) => {

    const sql = `
        UPDATE orders

        SET order_status = ?

        WHERE order_id = ?
    `;


    await db.query(
        sql,
        [
            status,
            orderId
        ]
    );


    return {

        message:
            "Order status updated successfully."

    };

};


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (
    customerId,
    deliveryData
) => {

    // Get database connection
    const connection =
        await db.getConnection();


    try {

        // =================================================
        // START TRANSACTION
        // =================================================

        await connection.beginTransaction();


        // =================================================
        // 1. GET CUSTOMER CART
        // =================================================

        const [cartRows] =
            await connection.query(
                `
                SELECT cart_id

                FROM cart

                WHERE customer_id = ?

                LIMIT 1
                `,
                [customerId]
            );


        if (cartRows.length === 0) {

            throw new Error(
                "Your cart is empty."
            );

        }


        const cartId =
            cartRows[0].cart_id;


        // =================================================
        // 2. GET CART ITEMS
        // =================================================

        const [cartItems] =
            await connection.query(
                `
                SELECT
                    ci.product_id,
                    ci.quantity,
                    p.price,
                    p.stock_quantity

                FROM cart_item ci

                JOIN product p
                    ON ci.product_id = p.product_id

                WHERE ci.cart_id = ?
                `,
                [cartId]
            );


        if (cartItems.length === 0) {

            throw new Error(
                "Your cart is empty."
            );

        }


        // =================================================
        // 3. CHECK STOCK + CALCULATE SUBTOTAL
        // =================================================

        let subtotal = 0;


        for (const item of cartItems) {

            if (
                item.quantity >
                item.stock_quantity
            ) {

                throw new Error(
                    `Product ${item.product_id} does not have enough stock.`
                );

            }


            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        }


        // =================================================
        // 4. CALCULATE DELIVERY FEE
        // =================================================

        let deliveryFee = 0;


        if (
            deliveryData.method === "standard"
        ) {

            deliveryFee = 100;

        }

        else if (
            deliveryData.method === "express"
        ) {

            deliveryFee = 200;

        }

        else if (
            deliveryData.method === "pickup"
        ) {

            deliveryFee = 0;

        }

        else {

            throw new Error(
                "Invalid delivery method."
            );

        }


        // =================================================
        // 5. CALCULATE TOTAL
        // =================================================

        const totalAmount =
            subtotal + deliveryFee;


        // =================================================
        // 6. CREATE ORDER
        // =================================================

        const [orderResult] =
            await connection.query(
                `
                INSERT INTO orders
                (
                    customer_id,
                    total_amount,
                    order_status
                )

                VALUES (?, ?, ?)
                `,
                [
                    customerId,
                    totalAmount,
                    "Pending"
                ]
            );


        const orderId =
            orderResult.insertId;


        // =================================================
        // 7. CREATE ORDER ITEMS + REDUCE STOCK
        // =================================================

        for (const item of cartItems) {

            await connection.query(
                `
                INSERT INTO order_item
                (
                    order_id,
                    product_id,
                    quantity,
                    unit_price
                )

                VALUES (?, ?, ?, ?)
                `,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]
            );


            // Reduce product stock

            await connection.query(
                `
                UPDATE product

                SET stock_quantity =
                    stock_quantity - ?

                WHERE product_id = ?
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );

        }


        // =================================================
        // 8. CREATE SHIPPING RECORD
        // =================================================

        await connection.query(
            `
            INSERT INTO shipping
            (
                order_id,
                recipient_name,
                phone_number,
                address,
                city,
                region,
                postal_code,
                shipping_status
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                orderId,
                deliveryData.name,
                deliveryData.phone,
                deliveryData.address,

                // The current delivery form does not
                // collect city separately.
                deliveryData.region,

                deliveryData.region,

                null,

                "Pending"
            ]
        );


        // =================================================
        // 9. CREATE INITIAL TRACKING RECORD
        // =================================================

        await connection.query(
            `
            INSERT INTO order_tracking
            (
                order_id,
                status,
                location
            )

            VALUES (?, ?, ?)
            `,
            [
                orderId,
                "Pending",
                deliveryData.region
            ]
        );


        // =================================================
        // 10. EMPTY CART
        // =================================================

        await connection.query(
            `
            DELETE FROM cart_item

            WHERE cart_id = ?
            `,
            [cartId]
        );


        // =================================================
        // 11. COMMIT TRANSACTION
        // =================================================

        await connection.commit();


        // =================================================
        // 12. RETURN ORDER INFORMATION
        // =================================================

        return {

            orderId,

            orderNumber:
                `DEN-${String(orderId).padStart(6, "0")}`,

            subtotal,

            deliveryFee,

            totalAmount,

            status: "Pending"

        };

    }


    catch (error) {

        // Undo all database changes
        await connection.rollback();

        throw error;

    }


    finally {

        // Return connection to pool
        connection.release();

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