const Customer = require("../models/customerModel");


const getAllCustomers = (req, res) => {

    Customer.getAllCustomers((err, customers) => {

        if (err) {

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });

        }

        res.status(200).json(customers);

    });

};

const updateCustomer = (req, res) => {

    const customerId = req.params.id;

    const customer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number
    };

    Customer.updateCustomer(
        customerId,
        customer,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }

            res.status(200).json({
                message: "Customer updated successfully"
            });

        }
    );

};

const deleteCustomer = (req, res) => {

    const customerId = req.params.id;

    Customer.deleteCustomer(
        customerId,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }

            res.status(200).json({
                message: "Customer deleted successfully"
            });

        }
    );

};


module.exports = {
    getAllCustomers,
    updateCustomer,
    deleteCustomer
};