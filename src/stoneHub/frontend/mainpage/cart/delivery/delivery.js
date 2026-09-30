"use strict";

/* =====================================================
   DENKYEMBO DELIVERY & ORDER
   -----------------------------------------------------
   Delivery information is sent to the backend.

   The backend must obtain the customer's cart using
   the authenticated user's token.

   Do NOT calculate the order subtotal on the frontend.
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const deliveryForm =
        document.getElementById(
            "deliveryForm"
        );

    const deliveryMethod =
        document.getElementById(
            "deliveryMethod"
        );

    const deliveryFee =
        document.getElementById(
            "deliveryFee"
        );

    const trackingNumber =
        document.getElementById(
            "trackingNumber"
        );

    const trackOrderButton =
        document.getElementById(
            "trackOrderButton"
        );

    const trackingResult =
        document.getElementById(
            "trackingResult"
        );


    /* =====================================================
       API
    ===================================================== */

    const ORDERS_API =
        "https://stonehub-backend-service.onrender.com/api/orders";

    const CART_API =
        "https://stonehub-backend-service.onrender.com/api/cart";


    /* =====================================================
       GET USER
    ===================================================== */

    function getUser() {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {

            return JSON.parse(
                savedUser
            );

        } catch (error) {

            console.error(
                "Invalid saved user:",
                error
            );

            return null;

        }

    }


    /* =====================================================
       GET TOKEN
    ===================================================== */

    function getToken() {

        const user =
            getUser();

        if (!user) {
            return null;
        }

        return (
            user.token ||
            user.accessToken ||
            user.jwt ||
            null
        );

    }


    /* =====================================================
       REQUEST HEADERS
    ===================================================== */

    function getHeaders() {

        return {

            "Content-Type":
                "application/json",

            "Authorization":
                `Bearer ${getToken()}`

        };

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(
        amount
    ) {

        return `GHS ${Number(
            amount || 0
        ).toLocaleString(
            "en-GH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    }


    /* =====================================================
       DELIVERY FEE
    ===================================================== */

    function calculateDeliveryFee() {

        if (
            !deliveryMethod ||
            !deliveryFee
        ) {

            return;

        }


        let fee = 0;


        if (
            deliveryMethod.value ===
            "standard"
        ) {

            fee = 100;

        }


        else if (
            deliveryMethod.value ===
            "express"
        ) {

            fee = 200;

        }


        else if (
            deliveryMethod.value ===
            "pickup"
        ) {

            fee = 0;

        }


        deliveryFee.textContent =
            formatPrice(fee);

    }


    if (deliveryMethod) {

        deliveryMethod.addEventListener(
            "change",
            calculateDeliveryFee
        );

    }


    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    const token =
        getToken();


    if (!token) {

        alert(
            "Please log in before continuing."
        );

        window.location.href =
            "../../customerRegistration/login.html";

        return;

    }


    /* =====================================================
       CHECK BACKEND CART
    ===================================================== */

    async function checkCart() {

        try {

            const response =
                await fetch(
                    CART_API,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                );


            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "../../customerRegistration/login.html";

                return false;

            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load cart."
                );

            }


            const items =
                Array.isArray(
                    data.items
                )
                    ? data.items
                    : [];


            if (
                items.length === 0
            ) {

                alert(
                    "Your cart is empty. Please add a product first."
                );

                window.location.href =
                    "../cart.html";

                return false;

            }


            return true;


        } catch (error) {

            console.error(
                "Cart check error:",
                error
            );

            alert(
                "Unable to verify your cart."
            );

            return false;

        }

    }


    /* =====================================================
       CONFIRM DELIVERY / CREATE ORDER
    ===================================================== */

    if (deliveryForm) {

        deliveryForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* =================================================
                   GET FORM DATA
                ================================================= */

                const name =
                    document
                        .getElementById(
                            "deliveryName"
                        )
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById(
                            "deliveryPhone"
                        )
                        .value
                        .trim();


                const region =
                    document
                        .getElementById(
                            "deliveryRegion"
                        )
                        .value;


                const city =
                    document
                        .getElementById(
                            "deliveryCity"
                        )
                        .value
                        .trim();


                const address =
                    document
                        .getElementById(
                            "deliveryAddress"
                        )
                        .value
                        .trim();


                const method =
                    document
                        .getElementById(
                            "deliveryMethod"
                        )
                        .value;


                /* =================================================
                   VALIDATION
                ================================================= */

                if (
                    !name ||
                    !phone ||
                    !region ||
                    !city ||
                    !address ||
                    !method
                ) {

                    alert(
                        "Please complete all delivery details."
                    );

                    return;

                }


                /* =================================================
                   CHECK CART
                ================================================= */

                const cartAvailable =
                    await checkCart();


                if (!cartAvailable) {
                    return;
                }


                /* =================================================
                   CREATE ORDER
                ================================================= */

                try {

                    const response =
                        await fetch(
                            ORDERS_API,
                            {
                                method: "POST",

                                headers:
                                    getHeaders(),

                                body:
                                    JSON.stringify({

                                        name:
                                            name,

                                        phone:
                                            phone,

                                        region:
                                            region,

                                        city:
                                            city,

                                        address:
                                            address,

                                        method:
                                            method

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Create order response:",
                        data
                    );


                    /* =================================================
                       AUTHENTICATION ERROR
                    ================================================= */

                    if (
                        response.status ===
                        401
                    ) {

                        localStorage.removeItem(
                            "user"
                        );

                        alert(
                            "Your session has expired. Please log in again."
                        );

                        window.location.href =
                            "../../customerRegistration/login.html";

                        return;

                    }


                    /* =================================================
                       ORDER ERROR
                    ================================================= */

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Unable to create order."
                        );

                        return;

                    }


                    /* =================================================
                       GET ORDER
                    ================================================= */

                    const order =
                        data.order;


                    if (!order) {

                        alert(
                            "Order was created, but no order information was returned."
                        );

                        return;

                    }


                    const orderNumber =
                        order.orderNumber ||
                        order.order_number ||
                        `DEN-${String(
                            order.order_id
                        ).padStart(
                            6,
                            "0"
                        )}`;


                    /* =================================================
                       SUCCESS MESSAGE
                    ================================================= */

                    alert(
                        `Order created successfully!\n\nYour order number is ${orderNumber}`
                    );


                    /* =================================================
                       DISPLAY ORDER
                    ================================================= */

                    if (
                        trackingResult
                    ) {

                        trackingResult.innerHTML = `

                            <h3>
                                Order Confirmed
                            </h3>

                            <p>
                                Order Number:
                                <strong>
                                    ${orderNumber}
                                </strong>
                            </p>

                            <p>
                                Status:
                                <strong>
                                    ${
                                        order.status ||
                                        "Pending"
                                    }
                                </strong>
                            </p>

                            <p>
                                Subtotal:
                                <strong>
                                    ${formatPrice(
                                        order.subtotal
                                    )}
                                </strong>
                            </p>

                            <p>
                                Delivery Fee:
                                <strong>
                                    ${formatPrice(
                                        order.deliveryFee
                                    )}
                                </strong>
                            </p>

                            <p>
                                Total:
                                <strong>
                                    ${formatPrice(
                                        order.totalAmount
                                    )}
                                </strong>
                            </p>

                        `;

                    }


                    /* =================================================
                       SET TRACKING NUMBER
                    ================================================= */

                    if (
                        trackingNumber
                    ) {

                        trackingNumber.value =
                            orderNumber;

                    }


                    /* =================================================
                       CLEAR FORM
                    ================================================= */

                    deliveryForm.reset();

                    calculateDeliveryFee();


                    /* =================================================
                       REFRESH NAVBAR CART
                    ================================================= */

                    if (
                        window.refreshBackendCart
                    ) {

                        await window.refreshBackendCart();

                    }


                } catch (error) {

                    console.error(
                        "Create order error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    /* =====================================================
       TRACK ORDER
    ===================================================== */

    if (trackOrderButton) {

        trackOrderButton.addEventListener(
            "click",
            async () => {

                const number =
                    trackingNumber.value
                        .trim()
                        .toUpperCase();


                if (!number) {

                    alert(
                        "Please enter your order number."
                    );

                    return;

                }


                /* =================================================
                   CHECK ORDER NUMBER
                ================================================= */

                if (
                    !number.startsWith(
                        "DEN-"
                    )
                ) {

                    trackingResult.innerHTML = `

                        <p>
                            Please enter a valid order number.

                            Example:

                            <strong>
                                DEN-000123
                            </strong>
                        </p>

                    `;

                    return;

                }


                const orderId =
                    parseInt(
                        number.replace(
                            "DEN-",
                            ""
                        ),
                        10
                    );


                if (
                    Number.isNaN(
                        orderId
                    )
                ) {

                    trackingResult.innerHTML = `

                        <p>
                            Invalid order number.
                        </p>

                    `;

                    return;

                }


                /* =================================================
                   GET ORDER
                ================================================= */

                try {

                    const response =
                        await fetch(
                            `${ORDERS_API}/${orderId}`,
                            {
                                method: "GET",

                                headers:
                                    getHeaders()

                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Tracking response:",
                        data
                    );


                    if (
                        response.status ===
                        401
                    ) {

                        localStorage.removeItem(
                            "user"
                        );

                        window.location.href =
                            "../../customerRegistration/login.html";

                        return;

                    }


                    if (!response.ok) {

                        trackingResult.innerHTML = `

                            <p>
                                ${
                                    data.message ||
                                    "Order not found."
                                }
                            </p>

                        `;

                        return;

                    }


                    /* =================================================
                       DISPLAY ORDER
                    ================================================= */

                    trackingResult.innerHTML = `

                        <h3>
                            Order Found
                        </h3>

                        <p>
                            Order Number:
                            <strong>
                                DEN-${String(
                                    data.order_id
                                ).padStart(
                                    6,
                                    "0"
                                )}
                            </strong>
                        </p>

                        <p>
                            Customer:
                            <strong>
                                ${
                                    data.customer_name ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <p>
                            Order Date:
                            <strong>
                                ${
                                    data.order_date ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <p>
                            Total:
                            <strong>
                                ${formatPrice(
                                    data.total_amount
                                )}
                            </strong>
                        </p>

                        <p>
                            Status:
                            <strong>
                                ${
                                    data.order_status ||
                                    "Pending"
                                }
                            </strong>
                        </p>

                    `;


                } catch (error) {

                    console.error(
                        "Tracking error:",
                        error
                    );


                    trackingResult.innerHTML = `

                        <p>
                            Unable to connect to the server.
                        </p>

                    `;

                }

            }
        );

    }


    /* =====================================================
       INITIAL DELIVERY FEE
    ===================================================== */

    calculateDeliveryFee();


    /* =====================================================
       INITIAL CART CHECK
    ===================================================== */

    checkCart();

});

