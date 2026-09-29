const shippingModel = require("../models/shippingModel");


// Save shipping details
const createShipping = async (req, res) => {

    try {

        const {
            orderId,
            recipientName,
            phoneNumber,
            address,
            city,
            region,
            postalCode
        } = req.body;


        // Validation
        if (
            !orderId ||
            !recipientName ||
            !phoneNumber ||
            !address ||
            !city ||
            !region
        ) {
            return res.status(400).json({
                message: "Please provide all required shipping details."
            });
        }


        const result = await shippingModel.createShipping({
            orderId,
            recipientName,
            phoneNumber,
            address,
            city,
            region,
            postalCode
        });


        res.status(201).json(result);


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Error saving shipping details.",
            error: error.message
        });

    }

};





// Get shipping details for an order
const getShippingByOrder = async (req, res) => {

    try {


        const { orderId } = req.params;


        const shipping =
            await shippingModel.getShippingByOrder(orderId);



        if (!shipping) {

            return res.status(404).json({
                message:"Shipping details not found."
            });

        }


        res.status(200).json(shipping);



    } catch(error){


        console.error(error);


        res.status(500).json({
            message:"Error retrieving shipping details.",
            error:error.message
        });


    }

};





// Update shipping status
const updateShippingStatus = async (req,res)=>{


    try{


        const { orderId } = req.params;

        const { status } = req.body;



        if(!status){

            return res.status(400).json({
                message:"Shipping status is required."
            });

        }



        const result =
        await shippingModel.updateShippingStatus(
            orderId,
            status
        );



        res.status(200).json(result);



    }catch(error){


        console.error(error);


        res.status(500).json({
            message:"Error updating shipping status.",
            error:error.message
        });


    }

};






// Delete shipping information
const deleteShipping = async(req,res)=>{


    try{


        const { orderId } = req.params;



        const result =
        await shippingModel.deleteShipping(orderId);



        res.status(200).json(result);



    }catch(error){


        console.error(error);


        res.status(500).json({
            message:"Error deleting shipping details.",
            error:error.message
        });


    }

};




module.exports = {

    createShipping,
    getShippingByOrder,
    updateShippingStatus,
    deleteShipping

};
