const express = require("express");

const router = express.Router();

const {
    authenticateAdmin
} = require("../middleware/authMiddleware");


// Protected admin test route
router.get(
    "/test",
    authenticateAdmin,
    (req, res) => {

        res.json({
            message: "You have access to the admin area.",
            admin: req.admin
        });

    }
);


module.exports = router;