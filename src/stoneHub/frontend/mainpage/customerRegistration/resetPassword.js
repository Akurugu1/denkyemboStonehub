const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const message =
    document.getElementById("message");


// Get token from the URL
const urlParams =
    new URLSearchParams(window.location.search);

const token =
    urlParams.get("token");


// Check whether token exists
if (!token) {

    message.textContent =
        "Invalid or missing password reset link.";

    resetPasswordForm.querySelector("button").disabled = true;
}


// Handle password reset
resetPasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        message.textContent = "";


        // Check passwords match
        if (newPassword !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        // Basic password validation
        if (newPassword.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        token: token,
                        newPassword: newPassword
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Password reset failed.";

                return;
            }


            // Success
            message.textContent =
                "Password reset successful. Redirecting to login...";


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 2000);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            message.textContent =
                "Unable to connect to the server. Please try again.";
        }
    }
);
