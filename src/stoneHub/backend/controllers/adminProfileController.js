const Admin = require("../models/adminModel");


/*
 * GET LOGGED-IN ADMIN PROFILE
 */
const getProfile = (req, res) => {

    const adminId = req.admin.admin_id;


    Admin.getAdminById(
        adminId,
        (err, results) => {

            /*
             * Database error
             */
            if (err) {

                return res.status(500).json({

                    message: "Database error"

                });

            }


            /*
             * Admin not found
             */
            if (results.length === 0) {

                return res.status(404).json({

                    message: "Admin not found"

                });

            }


            /*
             * Return the admin profile.
             *
             * Password is never returned.
             */
            const admin = results[0];


            return res.json({

                admin_id: admin.admin_id,

                full_name: admin.full_name,

                email: admin.email,

                role: admin.role

            });

        }

    );

};


module.exports = {
    getProfile
};