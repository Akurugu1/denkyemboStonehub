const express = require("express");

const router = express.Router();

const adminProfileController =
    require("../controllers/adminProfileController");

const {
    authenticateAdmin
} = require("../middleware/authMiddleware");


/*
 * Get the currently logged-in admin's profile.
 */
router.get(
    "/profile",
    authenticateAdmin,
    adminProfileController.getProfile
);


module.exports = router;