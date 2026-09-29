const db = require("../config/db");


/*
 * Find an admin using their email address.
 */
const findAdminByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM admin
        WHERE email = ?
    `;

    db.query(sql, [email], callback);

};


/*
 * Get an admin's profile using their admin ID.
 *
 * Password is deliberately NOT selected.
 */
const getAdminById = (adminId, callback) => {

    const sql = `
        SELECT
            admin_id,
            full_name,
            email,
            role
        FROM admin
        WHERE admin_id = ?
    `;

    db.query(sql, [adminId], callback);

};


module.exports = {
    findAdminByEmail,
    getAdminById
};