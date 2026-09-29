const trackingModel = require("../models/trackingModel");



// Create initial tracking record
const createTracking = async (req, res) => {

    try {

        const {
            orderId,
            status,
            location
        } = req.body;



        if (!orderId || !status) {

            return res.status(400).json({
                message: "Order ID and status are required."
            });

        }



        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];



        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid order status."
            });

        }



        const result = await trackingModel.createTracking({
            orderId,
            status,
            location
        });



        res.status(201).json(result);



    } catch(error) {


        console.error(error);


        res.status(500).json({
            message:"Error creating tracking record.",
            error:error.message
        });

    }

};





// Get tracking history for an order
const getTrackingByOrder = async (req,res)=>{


    try {


        const {
            orderId
        } = req.params;



        const tracking =
        await trackingModel.getTrackingByOrder(orderId);



        if(tracking.length === 0){

            return res.status(404).json({

                message:"No tracking information found."

            });

        }



        res.status(200).json({

            orderId,

            trackingHistory:tracking

        });



    } catch(error){


        console.error(error);


        res.status(500).json({

            message:"Error retrieving tracking information.",

            error:error.message

        });

    }

};






// Update order status
const updateTrackingStatus = async(req,res)=>{


    try{


        const {
            orderId
        } = req.params;



        const {
            status,
            location
        } = req.body;




        if(!status){

            return res.status(400).json({

                message:"Status is required."

            });

        }




        const allowedStatuses = [

            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"

        ];



        if(!allowedStatuses.includes(status)){


            return res.status(400).json({

                message:"Invalid order status."

            });

        }




        const result =
        await trackingModel.updateTrackingStatus(

            orderId,

            status,

            location

        );




        res.status(200).json(result);



    }catch(error){


        console.error(error);



        res.status(500).json({

            message:"Error updating order tracking.",

            error:error.message

        });

    }

};





module.exports = {

    createTracking,

    getTrackingByOrder,

    updateTrackingStatus

};
