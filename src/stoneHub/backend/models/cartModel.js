const db = require("../config/dbPromise");

// Get or create a cart for a customer
const getOrCreateCart = async (customerId) => {
    const [cart] = await db.query(
        "SELECT * FROM cart WHERE customer_id = ?",
        [customerId]
    );

    if (cart.length > 0) {
        return cart[0].cart_id;
    }

    const [result] = await db.query(
        "INSERT INTO cart (customer_id) VALUES (?)",
        [customerId]
    );

    return result.insertId;
};

// Add product to cart
const addToCart = async (customerId, productId, quantity) => {
    const cartId = await getOrCreateCart(customerId);

    const [existingItem] = await db.query(
        "SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?",
        [cartId, productId]
    );

    if (existingItem.length > 0) {
        await db.query(
            `UPDATE cart_item
             SET quantity = quantity + ?
             WHERE cart_id = ? AND product_id = ?`,
            [quantity, cartId, productId]
        );

        return {
            success: true,
            message: "Product quantity updated in cart."
        };
    }

    await db.query(
        `INSERT INTO cart_item (cart_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [cartId, productId, quantity]
    );

    return {
        success: true,
        message: "Product added to cart."
    };
};

// Remove product from cart
const removeFromCart = async (customerId, productId) => {
    const [cart] = await db.query(
        "SELECT cart_id FROM cart WHERE customer_id = ?",
        [customerId]
    );

    if (cart.length === 0) {
        return {
            success: false,
            message: "Cart not found."
        };
    }

    await db.query(
        "DELETE FROM cart_item WHERE cart_id = ? AND product_id = ?",
        [cart[0].cart_id, productId]
    );

    return {
        success: true,
        message: "Product removed from cart."
    };
};

// Update quantity
const updateQuantity = async (customerId, productId, quantity) => {
    const [cart] = await db.query(
        "SELECT cart_id FROM cart WHERE customer_id = ?",
        [customerId]
    );

    if (cart.length === 0) {
        return {
            success: false,
            message: "Cart not found."
        };
    }

    await db.query(
        `UPDATE cart_item
         SET quantity = ?
         WHERE cart_id = ? AND product_id = ?`,
        [quantity, cart[0].cart_id, productId]
    );

    return {
        success: true,
        message: "Quantity updated."
    };
};

// View cart
const viewCart = async (customerId) => {
    const [items] = await db.query(
        `
        SELECT
            p.product_id,
            p.product_name,
            p.price,
            p.image_url,
            ci.quantity,
            (p.price * ci.quantity) AS subtotal
        FROM cart c
        JOIN cart_item ci ON c.cart_id = ci.cart_id
        JOIN product p ON ci.product_id = p.product_id
        WHERE c.customer_id = ?
        `,
        [customerId]
    );

    return items;
};

// Calculate total
const calculateTotals = async (customerId) => {
    const [total] = await db.query(
        `
        SELECT
            IFNULL(SUM(p.price * ci.quantity),0) AS total
        FROM cart c
        JOIN cart_item ci ON c.cart_id = ci.cart_id
        JOIN product p ON ci.product_id = p.product_id
        WHERE c.customer_id = ?
        `,
        [customerId]
    );

    return total[0];
};

// Clear cart
const clearCart = async (customerId) => {
    const [cart] = await db.query(
        "SELECT cart_id FROM cart WHERE customer_id = ?",
        [customerId]
    );

    if (cart.length === 0) {
        return;
    }

    await db.query(
        "DELETE FROM cart_item WHERE cart_id = ?",
        [cart[0].cart_id]
    );
};

module.exports = {
    addToCart,
    removeFromCart,
    updateQuantity,
    viewCart,
    calculateTotals,
    clearCart
};
