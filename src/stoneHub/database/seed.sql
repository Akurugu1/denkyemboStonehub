USE railway;

-- =========================================================
-- 1. ADMIN
-- =========================================================
INSERT INTO admin
(full_name, password, email, role)
VALUES
('System Administrator', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'admin@stonehub.com', 'admin'),
('John Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'john.admin@stonehub.com', 'admin'),
('Sarah Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'sarah.admin@stonehub.com', 'admin'),
('Michael Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'michael.admin@stonehub.com', 'admin'),
('David Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'david.admin@stonehub.com', 'admin'),
('Linda Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'linda.admin@stonehub.com', 'admin'),
('James Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'james.admin@stonehub.com', 'admin'),
('Grace Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'grace.admin@stonehub.com', 'admin'),
('Daniel Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'daniel.admin@stonehub.com', 'admin'),
('Emily Admin', '$2b$10$/kD/UOmyiLi4845cHzTdqOIYoaYoNNfR1eETFkebSTthYVz1VnwQ6', 'emily.admin@stonehub.com', 'admin');

-- =========================================================
-- 2. CUSTOMERS
-- =========================================================

INSERT INTO customers
(first_name, last_name, email, phone_number, password, address, date_created)
VALUES
('Prince', 'Akurugu', 'akuruguprince0@gmail.com', '0241111111', 'Password123', 'Madina, Accra', '2026-07-23 17:32:02'),
('Sarah', 'Mensah', 'sarah@gmail.com', '0552222222', 'Password123', 'East Legon, Accra', '2026-07-23 17:32:02'),
('Michael', 'Boateng', 'michael@gmail.com', '0203333333', 'Password123', 'Cape Coast', '2026-07-23 17:32:02'),
('Ama', 'Owusu', 'ama.owusu@gmail.com', '0244444444', 'Password123', 'Osu, Accra', '2026-07-24 10:15:00'),
('Kofi', 'Asante', 'kofi.asante@gmail.com', '0555555555', 'Password123', 'Kumasi', '2026-07-25 12:20:00'),
('Jessica', 'Adjei', 'jessica.adjei@gmail.com', '0206666666', 'Password123', 'Spintex, Accra', '2026-07-26 14:30:00'),
('Daniel', 'Osei', 'daniel.osei@gmail.com', '0247777777', 'Password123', 'Tema, Accra', '2026-07-27 09:45:00'),
('Linda', 'Amoah', 'linda.amoah@gmail.com', '0558888888', 'Password123', 'Dansoman, Accra', '2026-07-28 16:10:00'),
('Kwame', 'Boateng', 'kwame.boateng@gmail.com', '0209999999', 'Password123', 'Takoradi', '2026-07-29 11:00:00'),
('Emily', 'Mensah', 'emily.mensah@gmail.com', '0241234567', 'Password123', 'Airport Residential, Accra', '2026-07-30 13:25:00');


-- =========================================================
-- 3. CATEGORY
-- =========================================================

INSERT INTO category
(category_name, description)
VALUES
('Granite', 'Natural granite stones and slabs'),
('Marble', 'Premium marble stones and slabs'),
('Quartz', 'Engineered quartz surfaces'),
('Limestone', 'Natural limestone products'),
('Travertine', 'Travertine tiles and slabs'),
('Onyx', 'Decorative and luxury onyx stones'),
('Slate', 'Natural slate products'),
('Sandstone', 'Natural sandstone products'),
('Porcelain', 'Porcelain tiles and surfaces'),
('Terrazzo', 'Terrazzo surfaces and tiles');


-- =========================================================
-- 4. SUPPLIER
-- =========================================================

INSERT INTO supplier
(company_name, contact_person, phone_number, email_address, address)
VALUES
('Ghana Stone Supplies', 'Kwesi Mensah', '0241111122', 'info@ghanastone.com', 'Accra, Ghana'),
('Premium Surfaces Ltd', 'Daniel Owusu', '0552222233', 'info@premiumsurfaces.com', 'Tema, Ghana'),
('Italian Marble Ghana', 'Marco Rossi', '0203333344', 'sales@italianmarble.com', 'Accra, Ghana'),
('West Africa Granite', 'Kofi Boateng', '0244444455', 'sales@wagranite.com', 'Kumasi, Ghana'),
('Modern Stone Works', 'Ama Asante', '0555555566', 'info@modernstone.com', 'Accra, Ghana'),
('Luxury Stone Ghana', 'Sarah Addo', '0206666677', 'sales@luxurystone.com', 'East Legon, Ghana'),
('Natural Stone Hub', 'Michael Osei', '0247777788', 'info@naturalstonehub.com', 'Takoradi, Ghana'),
('Royal Marble Ltd', 'Linda Mensah', '0558888899', 'sales@royalmarble.com', 'Tema, Ghana'),
('Stone Masters Ghana', 'James Asare', '0209999900', 'info@stonemasters.com', 'Accra, Ghana'),
('African Stone Co.', 'George Adjei', '0241234589', 'sales@africanstone.com', 'Kumasi, Ghana');


-- =========================================================
-- 5. PRODUCTS
-- =========================================================

INSERT INTO product
(product_name, description, price, stock_quantity, image_url, dimensions, material, category_id, supplier_id)
VALUES
(
    'Premium Granite',
    'Premium natural granite slab suitable for countertops and flooring.',
    1200.00,
    20,
    '/uploads/products/granite.jpg',
    '300x150 cm',
    'Granite',
    1,
    1
),

(
    'Premium Marble',
    'Premium marble slab with an elegant natural finish.',
    1800.00,
    15,
    '/uploads/products/marble.jpg',
    '250x150 cm',
    'Marble',
    2,
    3
),

(
    'Premium Quartz',
    'Durable engineered quartz surface for kitchens and interiors.',
    1500.00,
    24,
    '/uploads/products/quartz.jpg',
    '280x140 cm',
    'Quartz',
    3,
    2
),

(
    'Stone Installation',
    'Professional stone installation service.',
    900.00,
    19,
    '/uploads/products/installation.webp',
    'Service',
    'Natural Stone',
    4,
    1
),

(
    'Marble Collection',
    'Premium marble collection suitable for luxury interior projects.',
    2500.00,
    9,
    '/uploads/products/stack-marble-slabs-warehouse-setting-suitable-wide-range-uses-359375994.webp',
    '300x160 cm',
    'Marble',
    2,
    3
);

-- =========================================================
-- 6. ORDERS
-- =========================================================

INSERT INTO orders
(customer_id, order_date, total_amount, order_status)
VALUES
(1, '2026-08-01 10:15:00', 2400.00, 'Delivered'),
(2, '2026-08-02 11:30:00', 1800.00, 'Processing'),
(3, '2026-08-03 09:45:00', 1500.00, 'Shipped'),
(4, '2026-08-04 14:20:00', 2700.00, 'Delivered'),
(5, '2026-08-05 16:10:00', 2500.00, 'Pending'),
(6, '2026-08-06 12:00:00', 1650.00, 'Processing'),
(7, '2026-08-07 13:40:00', 1100.00, 'Delivered'),
(8, '2026-08-08 15:25:00', 3200.00, 'Shipped'),
(9, '2026-08-09 10:50:00', 850.00, 'Cancelled'),
(10, '2026-08-10 17:15:00', 1350.00, 'Pending');


-- =========================================================
-- 7. PAYMENT
-- =========================================================

INSERT INTO payment
(order_id, payment_method, payment_status, amount)
VALUES
(1, 'Mobile Money', 'Paid', 2400.00),
(2, 'Bank Transfer', 'Paid', 1800.00),
(3, 'Mobile Money', 'Paid', 1500.00),
(4, 'Bank Transfer', 'Paid', 2700.00),
(5, 'Mobile Money', 'Pending', 2500.00),
(6, 'Cash', 'Paid', 1650.00),
(7, 'Mobile Money', 'Paid', 1100.00),
(8, 'Bank Transfer', 'Paid', 3200.00),
(9, 'Mobile Money', 'Refunded', 850.00),
(10, 'Mobile Money', 'Pending', 1350.00);


-- =========================================================
-- 8. ORDER ITEMS
-- =========================================================

INSERT INTO order_item
(order_id, product_id, quantity, unit_price)
VALUES
(1, 1, 2, 1200.00),
(2, 2, 1, 1800.00),
(3, 3, 1, 1500.00),
(4, 4, 2, 1350.00),
(5, 5, 1, 2500.00),
(6, 6, 1, 1650.00),
(7, 8, 1, 1100.00),
(8, 9, 1, 3200.00),
(9, 10, 1, 850.00),
(10, 4, 1, 1350.00);


-- =========================================================
-- 9. CART
-- =========================================================

INSERT INTO cart
(customer_id, created_at)
VALUES
(1, '2026-08-01 09:00:00'),
(2, '2026-08-02 10:00:00'),
(3, '2026-08-03 08:30:00'),
(4, '2026-08-04 13:00:00'),
(5, '2026-08-05 15:00:00'),
(6, '2026-08-06 11:30:00'),
(7, '2026-08-07 12:45:00'),
(8, '2026-08-08 14:30:00'),
(9, '2026-08-09 10:00:00'),
(10, '2026-08-10 16:30:00');


-- =========================================================
-- 10. CART ITEMS
-- =========================================================

INSERT INTO cart_item
(cart_id, product_id, quantity)
VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 2),
(8, 8, 1),
(9, 9, 1),
(10, 10, 3);


-- =========================================================
-- 11. SHIPPING
-- =========================================================

INSERT INTO shipping
(order_id, recipient_name, phone_number, address, city, region, postal_code, shipping_status)
VALUES
(1, 'Prince Akurugu', '0241111111', 'Madina, Accra', 'Accra', 'Greater Accra', 'GA001', 'Delivered'),
(2, 'Sarah Mensah', '0552222222', 'East Legon, Accra', 'Accra', 'Greater Accra', 'GA002', 'Pending'),
(3, 'Michael Boateng', '0203333333', 'Cape Coast', 'Cape Coast', 'Central', 'CR001', 'Shipped'),
(4, 'Ama Owusu', '0244444444', 'Osu, Accra', 'Accra', 'Greater Accra', 'GA003', 'Delivered'),
(5, 'Kofi Asante', '0555555555', 'Kumasi', 'Kumasi', 'Ashanti', 'AS001', 'Pending'),
(6, 'Jessica Adjei', '0206666666', 'Spintex, Accra', 'Accra', 'Greater Accra', 'GA004', 'Pending'),
(7, 'Daniel Osei', '0247777777', 'Tema, Accra', 'Tema', 'Greater Accra', 'GA005', 'Delivered'),
(8, 'Linda Amoah', '0558888888', 'Dansoman, Accra', 'Accra', 'Greater Accra', 'GA006', 'Shipped'),
(9, 'Kwame Boateng', '0209999999', 'Takoradi', 'Takoradi', 'Western', 'WR001', 'Pending'),
(10, 'Emily Mensah', '0241234567', 'Airport Residential, Accra', 'Accra', 'Greater Accra', 'GA007', 'Pending');


-- =========================================================
-- 12. ORDER TRACKING
-- =========================================================

INSERT INTO order_tracking
(order_id, status, location, updated_at)
VALUES
(1, 'Delivered', 'Madina, Accra', '2026-08-05 15:00:00'),
(2, 'Processing', 'StoneHub Warehouse, Accra', '2026-08-06 10:30:00'),
(3, 'Shipped', 'Accra Distribution Centre', '2026-08-07 09:00:00'),
(4, 'Delivered', 'Osu, Accra', '2026-08-08 14:00:00'),
(5, 'Pending', 'StoneHub Warehouse', '2026-08-08 11:00:00'),
(6, 'Processing', 'StoneHub Warehouse', '2026-08-09 13:30:00'),
(7, 'Delivered', 'Tema, Accra', '2026-08-10 16:00:00'),
(8, 'Shipped', 'Accra Distribution Centre', '2026-08-11 10:00:00'),
(9, 'Cancelled', 'StoneHub Warehouse', '2026-08-11 12:00:00'),
(10, 'Pending', 'StoneHub Warehouse', '2026-08-12 09:30:00');


-- =========================================================
-- 13. REVIEWS
-- =========================================================

INSERT INTO reviews
(customer_id, product_id, rating, review_text, date_created, status)
VALUES
(1, 1, 5, 'Excellent granite quality and beautiful finish.', '2026-08-01 10:30:00', 'Published'),
(2, 2, 4, 'The marble looks beautiful and arrived safely.', '2026-08-02 12:00:00', 'Published'),
(3, 3, 5, 'Very durable quartz. Perfect for my kitchen.', '2026-08-03 14:15:00', 'Published'),
(4, 4, 3, 'Good product but delivery took longer than expected.', '2026-08-04 16:20:00', 'Pending'),
(5, 5, 5, 'The Calacatta marble looks amazing in my home.', '2026-08-05 11:45:00', 'Published'),
(6, 6, 4, 'Great quality and reasonable price.', '2026-08-06 13:10:00', 'Published'),
(7, 7, 2, 'The colour was slightly different from the pictures.', '2026-08-07 15:30:00', 'Flagged'),
(8, 8, 5, 'Beautiful travertine and excellent customer service.', '2026-08-08 10:00:00', 'Published'),
(9, 9, 4, 'Very attractive stone. Packaging could be improved.', '2026-08-09 17:00:00', 'Pending'),
(10, 10, 5, 'Excellent slate. I would definitely buy again.', '2026-08-10 18:30:00', 'Published');

