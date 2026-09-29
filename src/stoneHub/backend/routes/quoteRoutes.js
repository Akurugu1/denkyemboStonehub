const express = require("express");

const router = express.Router();

const quoteController =
    require("../controllers/quoteController");


/* ==========================================================
   CREATE QUOTE REQUEST
========================================================== */

router.post(
    "/",
    quoteController.createQuoteRequest
);


/* ==========================================================
   GET ALL QUOTE REQUESTS
========================================================== */

router.get(
    "/",
    quoteController.getAllQuoteRequests
);


module.exports = router;