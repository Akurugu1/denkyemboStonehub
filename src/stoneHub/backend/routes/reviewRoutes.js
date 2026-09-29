const express = require("express");

const router = express.Router();

const reviewController =
    require("../controllers/reviewController");


/* =========================================================
   GET ALL REVIEWS
   ========================================================= */

router.get(
    "/",
    reviewController.getAllReviews
);


/* =========================================================
   UPDATE REVIEW STATUS
   ========================================================= */

router.put(
    "/:id/status",
    reviewController.updateReviewStatus
);


/* =========================================================
   DELETE REVIEW
   ========================================================= */

router.delete(
    "/:id",
    reviewController.deleteReview
);


module.exports = router;