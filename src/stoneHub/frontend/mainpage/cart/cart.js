"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const cartItems =
        document.getElementById("cartItems");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartDelivery =
        document.getElementById("cartDelivery");

    const cartTotal =
        document.getElementById("cartTotal");

    const deliveryButton =
        document.getElementById("deliveryButton");

    const payNowButton =
        document.getElementById("payNowButton");

    const currencySwitcher =
        document.querySelector(".currency-switcher");


    /* ======================================================
       BACKEND
    ====================================================== */

    const API_URL =
        "http://localhost:5000/api/cart";


    /* ======================================================
       CURRENCY
    ====================================================== */

    let currentCurrency =
        localStorage.getItem("stoneHubCurrency") || "GHS";


    let exchangeRates = {

        GHS: 1,

        USD: 0,

        EUR: 0

    };


    /* ======================================================
       GET USER
    ====================================================== */

    function getUser() {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {

            return null;

        }

        try {

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Invalid user:",
                error
            );

            localStorage.removeItem("user");

            return null;

        }

    }


    /* ======================================================
       GET TOKEN
    ====================================================== */

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


    /* ======================================================
       HEADERS
    ====================================================== */

    function getHeaders() {

        const token =
            getToken();

        return {

            "Content-Type":
                "application/json",

            "Authorization":
                `Bearer ${token}`

        };

    }


    /* ======================================================
       LOGIN REDIRECT
    ====================================================== */

    function redirectToLogin() {

        localStorage.removeItem("user");

        window.location.href =
            "../customerRegistration/login.html";

    }


    /* ======================================================
       CURRENCY SWITCHER
    ====================================================== */

    if (currencySwitcher) {

        currencySwitcher.value =
            currentCurrency;


        currencySwitcher.addEventListener(
            "change",
            () => {

                currentCurrency =
                    currencySwitcher.value;

                localStorage.setItem(
                    "stoneHubCurrency",
                    currentCurrency
                );

                renderCurrentCart();

            }
        );

    }


    /* ======================================================
       LOAD EXCHANGE RATES
    ====================================================== */

    async function loadExchangeRates() {

        if (currentCurrency === "GHS") {

            return;

        }

        try {

            const response =
                await fetch(
                    "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=GHS,USD"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load exchange rates."
                );

            }


            const data =
                await response.json();


            const eurToGHS =
                data.find(
                    rate =>
                        rate.quote === "GHS"
                );


            const eurToUSD =
                data.find(
                    rate =>
                        rate.quote === "USD"
                );


            if (
                !eurToGHS ||
                !eurToUSD
            ) {

                throw new Error(
                    "Exchange rates unavailable."
                );

            }


            exchangeRates.GHS = 1;

            exchangeRates.USD =
                eurToUSD.rate /
                eurToGHS.rate;

            exchangeRates.EUR =
                1 /
                eurToGHS.rate;


        } catch (error) {

            console.error(
                "Exchange rate error:",
                error
            );

            exchangeRates.USD = 1;

            exchangeRates.EUR = 1;

        }

    }


    /* ======================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(
        priceInGHS
    ) {

        const amount =
            Number(priceInGHS) || 0;


        const rate =
            Number(
                exchangeRates[currentCurrency]
            ) || 1;


        const converted =
            amount * rate;


        const labels = {

            GHS: "GHS ",

            USD: "USD ",

            EUR: "EUR "

        };


        const label =
            labels[currentCurrency] ||
            `${currentCurrency} `;


        return (
            label +
            converted.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        );

    }


    /* ======================================================
       CURRENT CART
    ====================================================== */

    let currentCartItems = [];


    /* ======================================================
       LOAD CART
    ====================================================== */

    async function loadCart() {

        const token =
            getToken();


        if (!token) {

            alert(
                "Please log in to view your cart."
            );

            redirectToLogin();

            return;

        }


        cartItems.innerHTML = `

            <div class="loading-cart">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Loading your cart...
                </p>

            </div>

        `;


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                );


            const data =
                await response.json();


            console.log(
                "Cart:",
                data
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                alert(
                    "Your login session has expired."
                );

                redirectToLogin();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load cart."
                );

            }


            currentCartItems =
                Array.isArray(data.items)
                    ? data.items
                    : [];


            if (
                currentCartItems.length === 0
            ) {

                renderEmptyCart();

                updateCartBadge(0);

                return;

            }


            renderCart(
                currentCartItems
            );


            await loadCartTotal();


            updateCartBadge(
                getCartQuantity(
                    currentCartItems
                )
            );


        } catch (error) {

            console.error(
                "Load cart error:",
                error
            );


            cartItems.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h2>
                        Unable to load your cart
                    </h2>

                    <p>
                        Make sure the backend server
                        is running on port 5000.
                    </p>

                    <button
                        type="button"
                        onclick="location.reload()">

                        Try Again

                    </button>

                </div>

            `;

        }

    }


    /* ======================================================
       CART BADGE
    ====================================================== */

    function getCartQuantity(items) {

        return items.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(item.quantity || 0)
                );

            },
            0
        );

    }


    function updateCartBadge(
        quantity
    ) {

        const badges =
            document.querySelectorAll(
                ".cart-badge"
            );


        badges.forEach(
            badge => {

                badge.textContent =
                    quantity;

            }
        );

    }


    /* ======================================================
       EMPTY CART
    ====================================================== */

    function renderEmptyCart() {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some stone products to continue.
                </p>

                <a href="../catalogue/catalogue.html">

                    Continue Shopping

                </a>

            </div>

        `;


        cartSubtotal.textContent =
            formatPrice(0);

        cartDelivery.textContent =
            formatPrice(0);

        cartTotal.textContent =
            formatPrice(0);

    }


    /* ======================================================
       RENDER CART
    ====================================================== */

    function renderCart(
        items
    ) {

        cartItems.innerHTML = "";


        items.forEach(
            item => {

                const productId =
                    Number(
                        item.product_id
                    );


                const quantity =
                    Number(
                        item.quantity
                    ) || 0;


                const price =
                    Number(
                        item.price
                    ) || 0;


                const subtotal =
                    Number(
                        item.subtotal
                    ) ||
                    (
                        price *
                        quantity
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "cart-item";


                /* IMAGE */

                let imagePath =
                    "../images/placeholder.jpg";


                if (
                    item.image_url
                ) {

                    if (
                        item.image_url.startsWith(
                            "http"
                        )
                    ) {

                        imagePath =
                            item.image_url;

                    } else {

                        imagePath =
                            `http://localhost:5000${item.image_url}`;

                    }

                }


                article.innerHTML = `

                    <img
                        src="${imagePath}"
                        alt="${item.product_name || "Stone Product"}"
                        onerror="
                            this.onerror=null;
                            this.src='../images/placeholder.jpg';
                        "
                    >


                    <div class="cart-item-info">

                        <h3>
                            ${item.product_name || "Stone Product"}
                        </h3>

                        <p>
                            ${formatPrice(price)}
                        </p>

                    </div>


                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="decrease-btn"
                            data-product-id="${productId}"
                            data-quantity="${quantity}"
                            aria-label="Decrease quantity">

                            −

                        </button>


                        <strong>
                            ${quantity}
                        </strong>


                        <button
                            type="button"
                            class="increase-btn"
                            data-product-id="${productId}"
                            data-quantity="${quantity}"
                            aria-label="Increase quantity">

                            +

                        </button>

                    </div>


                    <strong class="item-subtotal">

                        ${formatPrice(subtotal)}

                    </strong>


                    <button
                        type="button"
                        class="remove-btn"
                        data-product-id="${productId}">

                        Remove

                    </button>

                `;


                cartItems.appendChild(
                    article
                );

            }
        );

    }


    /* ======================================================
       RENDER AGAIN AFTER CURRENCY CHANGE
    ====================================================== */

    function renderCurrentCart() {

        if (
            currentCartItems.length === 0
        ) {

            renderEmptyCart();

            return;

        }


        renderCart(
            currentCartItems
        );


        loadCartTotal();

    }


    /* ======================================================
       LOAD TOTAL
    ====================================================== */

    async function loadCartTotal() {

        try {

            const response =
                await fetch(
                    `${API_URL}/total`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                redirectToLogin();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to calculate cart total."
                );

            }


            const subtotal =
                Number(
                    data.totalAmount ||
                    data.total_amount ||
                    0
                );


            const delivery =
                0;


            const total =
                subtotal + delivery;


            cartSubtotal.textContent =
                formatPrice(subtotal);


            cartDelivery.textContent =
                formatPrice(delivery);


            cartTotal.textContent =
                formatPrice(total);


        } catch (error) {

            console.error(
                "Cart total error:",
                error
            );

        }

    }


    /* ======================================================
       UPDATE QUANTITY
    ====================================================== */

    async function updateQuantity(
        productId,
        quantity
    ) {

        if (
            quantity < 1
        ) {

            await removeFromCart(
                productId
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/update`,
                    {
                        method: "PUT",

                        headers:
                            getHeaders(),

                        body:
                            JSON.stringify({

                                productId:
                                    productId,

                                quantity:
                                    quantity

                            })

                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                alert(
                    "Your session has expired."
                );

                redirectToLogin();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update quantity."
                );

            }


            await loadCart();

        } catch (error) {

            console.error(
                "Quantity update error:",
                error
            );


            alert(
                error.message ||
                "Unable to update quantity."
            );

        }

    }


    /* ======================================================
       REMOVE ITEM
    ====================================================== */

    async function removeFromCart(
        productId
    ) {

        try {

            const response =
                await fetch(
                    `${API_URL}/remove`,
                    {
                        method: "DELETE",

                        headers:
                            getHeaders(),

                        body:
                            JSON.stringify({

                                productId:
                                    productId

                            })

                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                redirectToLogin();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to remove item."
                );

            }


            await loadCart();

        } catch (error) {

            console.error(
                "Remove error:",
                error
            );


            alert(
                error.message ||
                "Unable to remove product."
            );

        }

    }


    /* ======================================================
       CART BUTTONS
    ====================================================== */

    cartItems.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            const productId =
                Number(
                    button.dataset.productId
                );


            const quantity =
                Number(
                    button.dataset.quantity
                );


            if (
                button.classList.contains(
                    "increase-btn"
                )
            ) {

                await updateQuantity(
                    productId,
                    quantity + 1
                );

            }


            else if (
                button.classList.contains(
                    "decrease-btn"
                )
            ) {

                if (
                    quantity <= 1
                ) {

                    await removeFromCart(
                        productId
                    );

                } else {

                    await updateQuantity(
                        productId,
                        quantity - 1
                    );

                }

            }


            else if (
                button.classList.contains(
                    "remove-btn"
                )
            ) {

                await removeFromCart(
                    productId
                );

            }

        }
    );


    /* ======================================================
       CHECK IF CART HAS ITEMS
    ====================================================== */

    async function hasCartItems() {

        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                );


            if (!response.ok) {

                return false;

            }


            const data =
                await response.json();


            return (
                Array.isArray(data.items) &&
                data.items.length > 0
            );

        } catch (error) {

            return false;

        }

    }


    /* ======================================================
       DELIVERY BUTTON
    ====================================================== */

    if (deliveryButton) {

        deliveryButton.addEventListener(
            "click",
            async () => {

                const hasItems =
                    await hasCartItems();


                if (!hasItems) {

                    alert(
                        "Your cart is empty. Please add a product first."
                    );

                    return;

                }


                window.location.href =
                    "delivery/delivery.html";

            }
        );

    }


    /* ======================================================
       PAYMENT
    ====================================================== */

    if (payNowButton) {

        payNowButton.addEventListener(
            "click",
            async () => {

                const hasItems =
                    await hasCartItems();


                if (!hasItems) {

                    alert(
                        "Your cart is empty. Please add a product first."
                    );

                    return;

                }


                alert(
                    "Payment gateway will be connected here."
                );

            }
        );

    }


    /* ======================================================
       INITIAL LOAD
    ====================================================== */

    (async () => {

        await loadExchangeRates();

        await loadCart();

    })();

});