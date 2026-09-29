document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            console.log("Login response:", data);


            // =================================================
            // LOGIN SUCCESSFUL
            // =================================================

            if (response.ok) {

                alert("Login successful!");


                /*
                    Save the complete login response.

                    This normally contains:
                    - customer information
                    - JWT token

                    The token will later be used when
                    creating an order.
                */

                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );


                // Go back to the main page

                window.location.href =
                    "../index.html";

            }


            // =================================================
            // LOGIN FAILED
            // =================================================

            else {

                errorMessage.textContent =
                    data.message ||
                    "Invalid login details.";

            }


        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );


            errorMessage.textContent =
                "Unable to connect to server.";

        }

    });

});