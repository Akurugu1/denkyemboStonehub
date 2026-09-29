const quoteModel = require("../models/quoteModel");


/* ==========================================================
   CREATE QUOTE REQUEST
========================================================== */

const createQuoteRequest = async (req, res) => {

    try {

        const {
            productId,
            fullName,
            email,
            phoneNumber,
            quantity,
            message
        } = req.body;


        /* ------------------------------------------------------
           VALIDATION
        ------------------------------------------------------ */

        if (
            !productId ||
            !fullName ||
            !email ||
            !phoneNumber
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });

        }


        /* ------------------------------------------------------
           SAVE QUOTE REQUEST
        ------------------------------------------------------ */

        const result =
            await quoteModel.createQuoteRequest(
                productId,
                fullName,
                email,
                phoneNumber,
                quantity || null,
                message || null
            );


        /* ------------------------------------------------------
           SUCCESS
        ------------------------------------------------------ */

        res.status(201).json({

            success: true,

            message:
                "Quote request submitted successfully.",

            quoteId:
                result.insertId

        });


    } catch (error) {

        console.error(
            "Error creating quote request:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to submit quote request."

        });

    }

};


/* ==========================================================
   GET ALL QUOTE REQUESTS
========================================================== */

const getAllQuoteRequests = async (req, res) => {

    try {

        const quotes =
            await quoteModel.getAllQuoteRequests();


        res.status(200).json({

            success: true,

            quotes

        });


    } catch (error) {

        console.error(
            "Error fetching quote requests:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch quote requests."

        });

    }

};


/* ==========================================================
   EXPORT CONTROLLERS
========================================================== */

module.exports = {
    createQuoteRequest,
    getAllQuoteRequests
};