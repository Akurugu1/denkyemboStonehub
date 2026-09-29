const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Customer = require("../models/customerModel");
const PasswordReset = require("../models/passwordResetModel");
const { sendEmail } = require("../utils/emailService");

// REGISTER CUSTOMER
const register = (req, res) => {

    const {
        first_name,
        last_name,
        email,
        phone_number,
        password,
        address
    } = req.body;


    // Check if customer already exists
    Customer.findCustomerByEmail(email, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }


        if (results.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }


        // Encrypt password
        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) {
                return res.status(500).json({
                    message: "Password encryption failed"
                });
            }


            const customer = {
                first_name,
                last_name,
                email,
                phone_number,
                password: hashedPassword,
                address
            };


            Customer.createCustomer(customer, (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Registration failed",
                        error: err.message
                    });
                }


                res.status(201).json({
                    message: "Customer registered successfully",
                    customer_id: result.insertId
                });

            });

        });

    });
};



// LOGIN CUSTOMER
const login = (req, res) => {

    const { email, password } = req.body;


    Customer.findCustomerByEmail(email, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }


        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const customer = results[0];


        bcrypt.compare(password, customer.password, (err, match) => {

            if (!match) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }


            const token = jwt.sign(
                {
                    customer_id: customer.customer_id,
                    email: customer.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );


            res.json({
                message: "Login successful",
                token
            });

        });

    });

};

//Forgot Password
const forgotPassword = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    Customer.findCustomerByEmail(email, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.json({
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }

        const customer = results[0];

        const resetToken = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        PasswordReset.deleteCustomerTokens(
            customer.customer_id,
            (deleteErr) => {

                if (deleteErr) {
                    return res.status(500).json({
                        message: "Could not create password reset request"
                    });
                }

                PasswordReset.createResetToken(
                    customer.customer_id,
                    tokenHash,
                    expiresAt,
                    async (insertErr) => {

                        if (insertErr) {
                            return res.status(500).json({
                                message: "Could not create password reset request"
                            });
                        }

                        const resetLink =
    `http://127.0.0.1:5500/src/stoneHub/frontend/mainpage/customerRegistration/resetPassword.html?token=${resetToken}&email=${encodeURIComponent(email)}`;
await sendEmail({
    from: `"StoneHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Denkyembo Password Reset",
    text: `You requested to reset your StoneHub password.

Click the link below to reset your password:

${resetLink}

This link will expire in 30 minutes.

If you did not request a password reset, you can ignore this email.`,
});

res.json({
    message: "If an account exists with this email, a password reset link has been sent."
});
                    }
                );

            }
        );

    });
};

// RESET PASSWORD
const resetPassword = (req, res) => {

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            message: "Token and new password are required"
        });
    }

    // Hash the token received from the user
    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find valid token
    PasswordReset.findValidResetToken(
        tokenHash,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(400).json({
                    message: "Invalid or expired reset token"
                });
            }

            const resetToken = results[0];

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {

                if (err) {
                    return res.status(500).json({
                        message: "Password encryption failed"
                    });
                }

                // Update customer's password
                PasswordReset.updateCustomerPassword(
                    resetToken.customer_id,
                    hashedPassword,
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Password reset failed"
                            });
                        }

                        // Mark token as used
                        PasswordReset.markTokenAsUsed(
                            resetToken.id,
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: "Password updated but token could not be marked as used"
                                    });
                                }

                                return res.json({
                                    message: "Password reset successful"
                                });

                            }
                        );

                    }
                );

            });

        }
    );
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};