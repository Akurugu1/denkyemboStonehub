const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const message =
    document.getElementById("message");


forgotPasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        message.textContent = "";

        if (!email) {
            message.textContent =
                "Please enter your email address.";
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await response.json();

            message.textContent =
                data.message ||
                "If an account exists with this email, a password reset link has been sent.";

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            message.textContent =
                "Unable to connect to the server. Please try again.";
        }
    }
);