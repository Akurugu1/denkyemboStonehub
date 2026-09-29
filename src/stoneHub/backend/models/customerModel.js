const db = require("../config/db");


const createCustomer = (customer, callback) => {

    const sql = `
        INSERT INTO customers
        (first_name, last_name, email, phone_number, password, address, date_created)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone_number,
        customer.password,
        customer.address
    ];

    db.query(sql, values, callback);
};


const findCustomerByEmail = (email, callback) => {

    const sql = `
        SELECT * FROM customers
        WHERE email = ?
    `;

    db.query(sql, [email], callback);
};

const getAllCustomers = (callback) => {

    const sql = `
        SELECT
            customer_id,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            date_created
        FROM customers
    `;

    db.query(sql, callback);
};


const updateCustomer = (id, customer, callback) => {

    const sql = `
        UPDATE customers
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone_number = ?
        WHERE customer_id = ?
    `;

    const values = [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone_number,
        id
    ];

    db.query(sql, values, callback);
};

const deleteCustomer = (id, callback) => {

    const sql = `
        DELETE FROM customers
        WHERE customer_id = ?
    `;

    db.query(sql, [id], callback);
};

module.exports = {
    createCustomer,
    findCustomerByEmail,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
};