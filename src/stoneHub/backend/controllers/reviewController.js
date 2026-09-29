const Review = require("../models/reviewModel");


/* =========================================================
   GET ALL REVIEWS
   ========================================================= */

const getAllReviews = (req, res) => {

    Review.getAllReviews((err, reviews) => {

        if (err) {

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });

        }

        res.status(200).json(reviews);

    });

};


/* =========================================================
   UPDATE REVIEW STATUS
   ========================================================= */

const updateReviewStatus = (req, res) => {

    const reviewId = req.params.id;

    const { status } = req.body;


    if (!status) {

        return res.status(400).json({
            message: "Status is required"
        });

    }


    Review.updateReviewStatus(
        reviewId,
        status,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            res.status(200).json({
                message: "Review status updated successfully"
            });

        }
    );

};


/* =========================================================
   DELETE REVIEW
   ========================================================= */

const deleteReview = (req, res) => {

    const reviewId = req.params.id;


    Review.deleteReview(
        reviewId,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            res.status(200).json({
                message: "Review deleted successfully"
            });

        }
    );

};


module.exports = {
    getAllReviews,
    updateReviewStatus,
    deleteReview
};