const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");



/*
 * ADMIN LOGIN
 */
const login = (req, res) => {

    const {
        email,
        password
    } = req.body;


    /*
     * Find admin by email.
     */

    Admin.findAdminByEmail(
        email,
        (err, results) => {


            /*
             * Database error.
             */

            if (err) {

                return res.status(500).json({

                    message: "Database error"

                });

            }


            /*
             * Admin does not exist.
             */

            if (results.length === 0) {

                return res.status(401).json({

                    message: "Invalid email or password"

                });

            }


            /*
             * Get the admin record.
             */

            const admin = results[0];


            /*
             * Compare the entered password
             * with the hashed password
             * stored in the database.
             */

            bcrypt.compare(
                password,
                admin.password,
                (err, match) => {


                    /*
                     * Password comparison error.
                     */

                    if (err) {

                        return res.status(500).json({

                            message: "Authentication failed"

                        });

                    }


                    /*
                     * Password is incorrect.
                     */

                    if (!match) {

                        return res.status(401).json({

                            message: "Invalid email or password"

                        });

                    }


                    /*
                     * Create admin JWT.
                     */

                    const token = jwt.sign(

                        {
                            admin_id: admin.admin_id,

                            email: admin.email,

                            role: admin.role
                        },

                        process.env.JWT_SECRET,

                        {
                            expiresIn: "1h"
                        }

                    );


                    /*
                     * Send token to frontend.
                     */

                    return res.json({

                        message: "Admin login successful",

                        token

                    });

                }
            );

        }
    );

};



module.exports = {
    login
};