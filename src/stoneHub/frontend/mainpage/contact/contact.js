/* ==========================================================
   DENKYEMBO STONEHUB - CONTACT FORM
========================================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        /* ==================================================
           GET FORM VALUES
        ================================================== */

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* ==================================================
           BASIC VALIDATION
        ================================================== */

        if (!name || !email || !subject || !message) {

            alert("Please complete all required fields.");

            return;
        }


        /* ==================================================
           EMAIL VALIDATION
        ================================================== */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        /* ==================================================
           SEND MESSAGE TO BACKEND
        ================================================== */

        try {

            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        full_name: name,
                        email: email,
                        phone_number: phone,
                        subject: subject,
                        message: message
                    })
                }
            );


            const data = await response.json();


            /* ==================================================
               HANDLE RESPONSE
            ================================================== */

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Failed to send your message. Please try again."
                );

                return;
            }


            /* ==================================================
               SUCCESS
            ================================================== */

            alert(
                `Thank you, ${name}! Your message has been received. Our team will get back to you soon.`
            );


            /* ==================================================
               RESET FORM
            ================================================== */

            contactForm.reset();

        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            alert(
                "Unable to connect to the server. Please try again later."
            );
        }

    });

}