/* ==========================================================
   DENKYEMBO STONEHUB - REQUEST QUOTE
========================================================== */


/* ==========================================================
   LOAD PRODUCT INFORMATION
========================================================== */

async function loadQuoteProduct() {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("productId");

    const productInput =
        document.getElementById("product");


    /* ----------------------------------------------------------
       No product ID
    ---------------------------------------------------------- */

    if (!productId) {

        console.warn(
            "No productId was provided in the quote URL."
        );

        return;

    }


    /* ----------------------------------------------------------
       Product input not found
    ---------------------------------------------------------- */

    if (!productInput) {

        console.error(
            "Product input field was not found."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/products/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load product. Status: ${response.status}`
            );

        }


        const product =
            await response.json();


        console.log(
            "Quote product loaded:",
            product
        );


        /* ------------------------------------------------------
           Populate Product field
        ------------------------------------------------------ */

        productInput.value =
            product.product_name || "";


        /* ------------------------------------------------------
           Store Product ID
        ------------------------------------------------------ */

        productInput.dataset.productId =
            product.product_id || productId;


    } catch (error) {

        console.error(
            "Error loading product information:",
            error
        );

    }

}


/* ==========================================================
   RETURN TO PRODUCT DETAILS
========================================================== */

function setupReturnButton() {

    const returnProductBtn =
        document.getElementById("returnProductBtn");


    if (!returnProductBtn) {

        console.error(
            "Return to Product Details button was not found."
        );

        return;

    }


    returnProductBtn.addEventListener(
        "click",
        function () {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const productId =
                params.get("productId");


            /* --------------------------------------------------
               Return to the selected product
            -------------------------------------------------- */

            if (productId) {

                window.location.href =
                    `../catalogue/catalogue.html?productId=${productId}`;

            } else {

                /* ----------------------------------------------
                   No product ID â€” return to catalogue
                ---------------------------------------------- */

                window.location.href =
                    "../catalogue/catalogue.html";

            }

        }
    );

}


/* ==========================================================
   REQUEST QUOTE FORM
========================================================== */

function setupQuoteForm() {

    const quoteForm =
        document.getElementById("quoteForm");


    if (!quoteForm) {

        console.error(
            "Quote form was not found."
        );

        return;

    }


    quoteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* --------------------------------------------------
               GET PRODUCT ID FROM URL
            -------------------------------------------------- */

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const productId =
                params.get("productId");


            /* --------------------------------------------------
               GET FORM VALUES
            -------------------------------------------------- */

            const product =
                document
                    .getElementById("product")
                    .value
                    .trim();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const quantity =
                document
                    .getElementById("quantity")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            /* --------------------------------------------------
               DEBUG INFORMATION
            -------------------------------------------------- */

            console.log(
                "Quote submission data:",
                {
                    productId,
                    product,
                    fullName: name,
                    email,
                    phoneNumber: phone,
                    quantity,
                    message
                }
            );


            /* --------------------------------------------------
               VALIDATION
            -------------------------------------------------- */

            if (
                !productId ||
                !product ||
                !name ||
                !email ||
                !phone
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            /* --------------------------------------------------
               EMAIL VALIDATION
            -------------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            /* --------------------------------------------------
               SEND QUOTE REQUEST TO BACKEND
            -------------------------------------------------- */

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/quotes",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                productId: productId,

                                fullName: name,

                                email: email,

                                phoneNumber: phone,

                                quantity: quantity,

                                message: message

                            })

                        }
                    );


                const data =
                    await response.json();


                /* --------------------------------------------------
                   CHECK BACKEND RESPONSE
                -------------------------------------------------- */

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to submit quote request."
                    );

                }


                /* --------------------------------------------------
                   SUCCESS
                -------------------------------------------------- */

                alert(
                    `Thank you, ${name}! Your quote request has been received. Our team will get back to you soon.`
                );


                /* --------------------------------------------------
                   RESET FORM
                -------------------------------------------------- */

                quoteForm.reset();


                /*
                 * Re-populate the selected product after reset.
                 */

                await loadQuoteProduct();


            } catch (error) {

                console.error(
                    "Error submitting quote request:",
                    error
                );


                alert(
                    "Sorry, your quote request could not be submitted. Please try again."
                );

            }

        }
    );

}

/* ==========================================================
   INITIALIZE PAGE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadQuoteProduct();

        setupReturnButton();

        setupQuoteForm();

    }
);