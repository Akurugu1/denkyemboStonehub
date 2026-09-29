// Import database promise connection
const db = require("../config/dbPromise");


// Create a new contact message
const createContactMessage = async (
    full_name,
    email,
    phone_number,
    subject,
    message
) => {

    const sql = `
        INSERT INTO contact_messages
        (full_name, email, phone_number, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(
        sql,
        [full_name, email, phone_number, subject, message]
    );

    return result;
};


// Export function
module.exports = {
    createContactMessage
};