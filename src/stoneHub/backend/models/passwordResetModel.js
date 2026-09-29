const db = require("../config/db");


// CREATE PASSWORD RESET TOKEN
const createResetToken = (customerId, tokenHash, expiresAt, callback) => {

    const sql = `
        INSERT INTO password_reset_tokens
        (customer_id, token_hash, expires_at)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [customerId, tokenHash, expiresAt],
        callback
    );
};


// FIND VALID RESET TOKEN
const findValidResetToken = (tokenHash, callback) => {

    const sql = `
        SELECT *
        FROM password_reset_tokens
        WHERE token_hash = ?
        AND expires_at > NOW()
        AND used_at IS NULL
        LIMIT 1
    `;

    db.query(sql, [tokenHash], callback);
};


// MARK TOKEN AS USED
const markTokenAsUsed = (tokenId, callback) => {

    const sql = `
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [tokenId], callback);
};


// UPDATE CUSTOMER PASSWORD
const updateCustomerPassword = (customerId, hashedPassword, callback) => {

    const sql = `
        UPDATE customers
        SET password = ?
        WHERE customer_id = ?
    `;

    db.query(
        sql,
        [hashedPassword, customerId],
        callback
    );
};


// DELETE OLD TOKENS FOR CUSTOMER
const deleteCustomerTokens = (customerId, callback) => {

    const sql = `
        DELETE FROM password_reset_tokens
        WHERE customer_id = ?
    `;

    db.query(sql, [customerId], callback);
};


module.exports = {
    createResetToken,
    findValidResetToken,
    markTokenAsUsed,
    updateCustomerPassword,
    deleteCustomerTokens
};