USE railway;


-- =========================================================
-- 1. ADMIN
-- =========================================================

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(150) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL
);


-- =========================================================
-- 2. CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL,
    CHECK (phone_number REGEXP '^[0-9]{10}$'),
    password VARCHAR(150) NOT NULL,
    address VARCHAR(200),
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. CONTACT MESSAGES
-- =========================================================

CREATE TABLE contact_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM(
        'New',
        'Read',
        'Replied'
    ) NOT NULL DEFAULT 'New',
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. CATEGORY
-- =========================================================

CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500)
);


-- =========================================================
-- 5. SUPPLIER
-- =========================================================

CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    CHECK (phone_number REGEXP '^[0-9]{10}$'),
    email_address VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(200)
);


-- =========================================================
-- 6. PRODUCT
-- =========================================================

CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0,
    CHECK (stock_quantity >= 0),
    image_url VARCHAR(255),
    dimensions VARCHAR(100),
    material VARCHAR(100),

    category_id INT NOT NULL,
    supplier_id INT NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES category(category_id),

    FOREIGN KEY (supplier_id)
        REFERENCES supplier(supplier_id)
);


-- =========================================================
-- 7. CART
-- =========================================================

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. CART ITEMS
-- =========================================================

CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    CHECK (quantity > 0),

    FOREIGN KEY (cart_id)
        REFERENCES cart(cart_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);


-- =========================================================
-- 9. ORDERS
-- =========================================================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    total_amount DECIMAL(10,2) NOT NULL,

    CHECK (total_amount >= 0),

    order_status ENUM(
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);


-- =========================================================
-- 10. ORDER ITEMS
-- =========================================================

CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL,

    CHECK (quantity > 0),

    unit_price DECIMAL(10,2) NOT NULL,

    CHECK (unit_price >= 0),

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);


-- =========================================================
-- 11. SHIPPING / DELIVERY
-- =========================================================

CREATE TABLE shipping (
    shipping_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    recipient_name VARCHAR(100) NOT NULL,

    phone_number VARCHAR(10) NOT NULL,

    address VARCHAR(200) NOT NULL,

    city VARCHAR(100) NOT NULL,

    region VARCHAR(100) NOT NULL,

    postal_code VARCHAR(20),

    delivery_method ENUM(
        'standard',
        'express',
        'pickup'
    ) NOT NULL,

    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    shipping_status ENUM(
        'Pending',
        'Shipped',
        'Delivered'
    ) NOT NULL DEFAULT 'Pending',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 12. PAYMENT
-- =========================================================

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    payment_method ENUM(
        'Cash',
        'Mobile Money',
        'Bank Transfer'
    ) NOT NULL,

    payment_status ENUM(
        'Pending',
        'Paid',
        'Failed',
        'Refunded'
    ) NOT NULL DEFAULT 'Pending',

    amount DECIMAL(10,2) NOT NULL,

    CHECK (amount >= 0),

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- =========================================================
-- 13. INVOICE
-- =========================================================

CREATE TABLE invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    payment_id INT NOT NULL,

    invoice_status ENUM(
        'Pending',
        'Sent',
        'Failed'
    ) NOT NULL DEFAULT 'Pending',

    invoice_file VARCHAR(255),

    failure_reason TEXT,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    sent_at DATETIME,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id)
);

-- =========================================================
-- 14. ORDER TRACKING
-- =========================================================

CREATE TABLE order_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    status ENUM(
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) NOT NULL,

    location VARCHAR(150),

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 15. REVIEWS
-- =========================================================

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    product_id INT NOT NULL,

    rating INT NOT NULL,

    review_text VARCHAR(1000) NOT NULL,

    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'Published',
        'Pending',
        'Flagged'
    ) NOT NULL DEFAULT 'Pending',

    CHECK (rating >= 1 AND rating <= 5),

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id),

    FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);

CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE
);

