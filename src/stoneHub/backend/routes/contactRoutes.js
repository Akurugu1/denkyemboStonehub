// Import Express
const express = require("express");

// Create router
const router = express.Router();

// Import contact controller
const contactController = require("../controllers/contactController");


// POST /api/contact
router.post(
    "/",
    contactController.createContactMessage
);


// Export router
module.exports = router;