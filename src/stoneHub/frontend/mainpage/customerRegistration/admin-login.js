const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");


loginForm.addEventListener("submit", async (event) => {

    // Prevent the page from refreshing
    event.preventDefault();


    // Get the values entered into the form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    try {

        // Send the admin's credentials to the backend
        const response = await fetch(
            "https://stonehub-backend-service.onrender.com/api/admin/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        // Get the response from the server
        const data = await response.json();


        // Check whether the login failed
        if (!response.ok) {

            errorMessage.textContent =
                data.message || "Invalid email or password.";

            return;
        }


        // Login was successful
        console.log("Admin login successful");


        // Save the JWT token in the browser
        localStorage.setItem(
            "adminToken",
            data.token
        );


        // Take the admin to the existing dashboard
        window.location.href =
            "../../Admin/index.html";


    } catch (error) {

        console.error("Login error:", error);

        errorMessage.textContent =
            "Unable to connect to the server.";

    }

});
