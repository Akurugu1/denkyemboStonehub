const express = require("express");

const router = express.Router();

const adminAuthController =
    require("../controllers/adminAuthController");


// Admin login route
router.post(
    "/login",
    adminAuthController.login
);


module.exports = router;