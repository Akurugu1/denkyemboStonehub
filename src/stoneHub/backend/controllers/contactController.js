// Import contact model
const contactModel = require("../models/contactModel");


// Create contact message
const createContactMessage = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone_number,
            subject,
            message
        } = req.body;


        // Validate required fields
        if (!full_name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });

        }


        // Save message to database
        const result = await contactModel.createContactMessage(
            full_name,
            email,
            phone_number || null,
            subject,
            message
        );


        // Successful response
        res.status(201).json({
            success: true,
            message: "Your message has been received successfully.",
            message_id: result.insertId
        });

    } catch (error) {

        console.error(
            "Contact message error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to send your message."
        });

    }
};


// Export controller
module.exports = {
    createContactMessage
};