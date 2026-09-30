/* ==========================================================
   DENKYEMBO STONEHUB - PRODUCT CATALOGUE
========================================================== */

/* ==========================================================
   API
========================================================== */

const API_URL = "https://stonehub-backend-service.onrender.com/api/products";

/* ==========================================================
   IMAGE PATH
========================================================== */

const IMAGE_PATH = "../images/";

/* ==========================================================
   CURRENCY
   Database prices are stored in GHS.
========================================================== */

let currentCurrency =
    localStorage.getItem("stoneHubCurrency") ||
    "GHS";

let exchangeRates = {
    GHS: 1,
    USD: 0,
    EUR: 0
};

/* ==========================================================
   ELEMENTS
========================================================== */

const productGrid =
    document.getElementById("productGrid");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("productSearch");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const currencySwitcher =
    document.querySelector(".currency-switcher");

/* ==========================================================
   RESTORE SAVED CURRENCY
========================================================== */

if (currencySwitcher) {

    currencySwitcher.value =
        currentCurrency;

}



/* ==========================================================
   LOAD EXCHANGE RATES
========================================================== */

async function loadExchangeRates() {

    try {

        /*
         * Frankfurter uses EUR as a supported base currency.
         *
         * We retrieve:
         *
         * EUR -> GHS
         * EUR -> USD
         *
         * Then calculate:
         *
         * GHS -> USD
         * GHS -> EUR
         */

        const response = await fetch(
            "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=GHS,USD"
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load exchange rates."
            );

        }


        const data = await response.json();


        /*
         * The API returns an array such as:
         *
         * [
         *     {
         *         base: "EUR",
         *         quote: "GHS",
         *         rate: ...
         *     },
         *     {
         *         base: "EUR",
         *         quote: "USD",
         *         rate: ...
         *     }
         * ]
         */


        const eurToGHS =
            data.find(
                rate => rate.quote === "GHS"
            );


        const eurToUSD =
            data.find(
                rate => rate.quote === "USD"
            );


        if (!eurToGHS || !eurToUSD) {

            throw new Error(
                "Required exchange rates were not returned."
            );

        }


        /*
         * Convert from GHS.
         *
         * Example:
         *
         * 1 EUR = X GHS
         * 1 EUR = Y USD
         *
         * Therefore:
         *
         * 1 GHS = Y / X USD
         * 1 GHS = 1 / X EUR
         */


        exchangeRates.GHS = 1;


        exchangeRates.USD =
            eurToUSD.rate /
            eurToGHS.rate;


        exchangeRates.EUR =
            1 /
            eurToGHS.rate;


        console.log(
            "Exchange rates loaded:",
            exchangeRates
        );


        /*
         * Refresh displayed prices.
         */

        updateDisplayedPrices();


    } catch (error) {

        console.error(
            "Error loading exchange rates:",
            error
        );


        /*
         * Always keep GHS working.
         */

        exchangeRates.GHS = 1;

    }

}


/* ==========================================================
   FORMAT PRICE
========================================================== */

function formatPrice(priceInGHS) {

    const convertedPrice =
        Number(priceInGHS) *
        Number(
            exchangeRates[currentCurrency] || 1
        );

    const currencySymbols = {
        GHS: "GHS ",
        USD: "$",
        EUR: "EUR "
    };

    const symbol =
        currencySymbols[currentCurrency] ||
        currentCurrency;

    return `${symbol}${convertedPrice.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

}

/* ==========================================================
   CART BADGE
========================================================== */

const cartBadge =
    document.querySelector(".cart-badge");


async function updateCartBadge() {

    if (!cartBadge) {
        return;
    }


    const storedUser =
        localStorage.getItem("user");


    /*
     * If the customer is not logged in,
     * keep the badge at 0.
     */

    if (!storedUser) {

        cartBadge.textContent = "0";

        return;

    }


    let user;

    try {

        user = JSON.parse(storedUser);

    } catch (error) {

        cartBadge.textContent = "0";

        return;

    }


    const token = user.token;


    if (!token) {

        cartBadge.textContent = "0";

        return;

    }


    try {

        const response =
            await fetch(
                "https://stonehub-backend-service.onrender.com/api/cart",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            cartBadge.textContent = "0";

            return;

        }


        const data =
            await response.json();


        const items =
            data.items || [];


        /*
         * Add all quantities together.
         *
         * Example:
         * Product A = 2
         * Product B = 3
         * Badge = 5
         */

        const totalQuantity =
            items.reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );


        cartBadge.textContent =
            totalQuantity;

    } catch (error) {

        console.error(
            "Unable to update cart badge:",
            error
        );


        /*
         * Do not break the catalogue
         * if the cart request fails.
         */

        cartBadge.textContent = "0";

    }

}

/* ==========================================================
   LOAD ALL PRODUCTS
========================================================== */

async function loadProducts() {

    showLoading();

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load products."
            );

        }

        const products =
            await response.json();

        displayProducts(products);

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        showError();

    }

}


/* ==========================================================
   LOAD PRODUCTS BY CATEGORY
========================================================== */

async function loadProductsByCategory(categoryId) {

    showLoading();

    try {

        const response =
            await fetch(
                `${API_URL}/category/${categoryId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load category products."
            );

        }

        const products =
            await response.json();

        displayProducts(products);

    } catch (error) {

        console.error(
            "Error loading category products:",
            error
        );

        showError();

    }

}


/* ==========================================================
   DISPLAY PRODUCTS
========================================================== */

function displayProducts(products) {

    productGrid.innerHTML = "";

    hideMessages();


    if (!products || products.length === 0) {

        productGrid.innerHTML = `

            <div class="catalogue-message">

                <i class="fa-solid fa-box-open"></i>

                <p>
                    No products found.
                </p>

            </div>

        `;

        return;

    }


    products.forEach(product => {

    const productCard =
        document.createElement("article");

    productCard.classList.add("product-card");

    const imageUrl =
        product.image_url
            ? (
                product.image_url.startsWith("http")
                    ? product.image_url
                    : `https://stonehub-backend-service.onrender.com${product.image_url}`
            )
            : "../images/placeholder.jpg";

    const priceInGHS =
        Number(
            product.price_per_square_foot ??
            product.price ??
            0
        );

    const stoneType =
        product.stone_type ||
        product.category_name ||
        product.material ||
        "Stone";

    productCard.innerHTML = `

        <div class="product-image">

            <img
                src="${imageUrl}"
                alt="${product.product_name || "Stone product"}"
                loading="lazy"
                decoding="async"
                onerror="this.src='../images/placeholder.jpg'"
            >

        </div>

        <div class="product-details">

            <span class="product-category">
                ${stoneType}
            </span>

            <h3>
                ${product.product_name}
            </h3>

            <p>
                ${
                    product.description ||
                    "Premium natural stone product."
                }
            </p>

            <div
                class="product-price"
                data-price="${priceInGHS}"
            >
                ${formatPrice(priceInGHS)} / sq. ft.
            </div>

            <a
                href="#"
                class="product-btn"
                data-product-id="${product.product_id}"
            >
                View Details
                <i class="fa-solid fa-arrow-right"></i>
            </a>

        </div>

    `;

    productGrid.appendChild(productCard);

});

}


/* ==========================================================
   VIEW PRODUCT DETAILS
========================================================== */

async function viewProductDetails(productId) {

    try {

        /*
         * Load one product from the backend.
         */

        const response =
            await fetch(
                `${API_URL}/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load product details."
            );

        }


        const product =
            await response.json();


        /*
         * Store original GHS price.
         */

        const priceInGHS =
          Number(
        product.price_per_square_foot ??
        product.price ??
        0
     );
        /*
         * Build product image path.
         */

        const imageUrl =
                product.image_url
                    ? (
                        product.image_url.startsWith("http")
                            ? product.image_url
                            : `https://stonehub-backend-service.onrender.com${product.image_url}`
                    )
                    : "../images/placeholder.jpg";


        /*
         * Display product details.
         */

        productGrid.innerHTML = `

            <div class="product-detail-view">

                <button
                    type="button"
                    class="back-to-catalogue"
                    id="backToCatalogue"
                >

                    <i class="fa-solid fa-arrow-left"></i>

                    Back to Catalogue

                </button>


                <div class="product-detail-card">


                    <div class="product-detail-image">

                        <img
                            src="${imageUrl}"
                            alt="${product.product_name || "Stone product"}"
                            onerror="this.src='../images/placeholder.jpg'"
                        >

                    </div>


                    <div class="product-detail-info">

                        <span class="product-category">

                            ${product.category_name || "Stone"}

                        </span>


                        <h2>

                            ${product.product_name}

                        </h2>


                        <p class="product-description">

                            ${
                                product.description ||
                                "Premium natural stone product."
                            }

                        </p>


                        <div
                          class="product-price"
                          data-price="${priceInGHS}"
                           >
                              ${formatPrice(priceInGHS)} / sq. ft.
                            </div>


                        <div class="product-detail-meta">

                            <div class="product-detail-item">

                                <strong>Material:</strong>

                                <span>
                                    ${product.material || "N/A"}
                                </span>

                            </div>


                            <div class="product-detail-item">

                                <strong>Dimensions:</strong>

                                <span>
                                    ${product.dimensions || "N/A"}
                                </span>

                            </div>


                            <div class="product-detail-item">

                                <strong>Available Stock:</strong>

                                <span>
                                    ${product.stock_quantity ?? 0}
                                </span>

                            </div>

                        </div>


                        <div class="product-actions">

                            <button
                                type="button"
                                class="product-btn add-to-cart-btn"
                                id="addToCartBtn"
                            >

                                <i class="fa-solid fa-cart-plus"></i>

                                Add to Cart

                            </button>


                            <button
                                type="button"
                                class="product-btn"
                                id="requestQuoteBtn"
                            >

                                Request Quote

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>

                        </div>

                    </div>


                </div>

            </div>

        `;


        /*
         * Hide catalogue heading and
         * category filters.
         */

        const catalogueHeading =
            document.querySelector(
                ".catalogue-heading"
            );

        const categoryFilters =
            document.querySelector(
                ".category-filters"
            );


        if (catalogueHeading) {

            catalogueHeading.style.display =
                "none";

        }


        if (categoryFilters) {

            categoryFilters.style.display =
                "none";

        }


        /*
         * Back to Catalogue button.
         */

        const backButton =
            document.getElementById(
                "backToCatalogue"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    if (catalogueHeading) {

                        catalogueHeading.style.display =
                            "";

                    }


                    if (categoryFilters) {

                        categoryFilters.style.display =
                            "";

                    }


                    loadProducts();

                }
            );

        }


        /*
         * Request Quote button.
         */

        /* ==========================================================
           REQUEST QUOTE BUTTON
        ========================================================== */

        const requestQuoteBtn =
            document.getElementById(
                "requestQuoteBtn"
            );

        if (requestQuoteBtn) {

            requestQuoteBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `../quote/quote.html?productId=${product.product_id}`;

                }
            );

        }

        const addToCartBtn =
            document.getElementById("addToCartBtn");

        if (addToCartBtn) {

            addToCartBtn.addEventListener(
                "click",
                () => {

                    addProductToCart(
                        product.product_id
                    );

                }
            );

        }


    } catch (error) {

        console.error(
            "Error loading product details:",
            error
        );


        productGrid.innerHTML = `

            <div class="catalogue-message">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>

                    Unable to load product details.

                </p>


                <button
                    type="button"
                    class="back-to-catalogue"
                    id="errorBackToCatalogue"
                >

                    Back to Catalogue

                </button>

            </div>

        `;


        const errorBackButton =
            document.getElementById(
                "errorBackToCatalogue"
            );


        if (errorBackButton) {

            errorBackButton.addEventListener(
                "click",
                loadProducts
            );

        }

    }

}

/* ==========================================================
   ADD PRODUCT TO CART
========================================================== */

async function addProductToCart(productId) {

    const storedUser =
        localStorage.getItem("user");


    if (!storedUser) {

        alert(
            "Please log in before adding products to your cart."
        );

        window.location.href =
            "../customerRegistration/login.html";

        return;
    }


    let user;

    try {

        user =
            JSON.parse(storedUser);

    } catch (error) {

        localStorage.removeItem("user");

        alert(
            "Please log in again."
        );

        window.location.href =
            "../customerRegistration/login.html";

        return;
    }


    const token =
        user.token;


    if (!token) {

        alert(
            "Please log in again."
        );

        localStorage.removeItem("user");

        window.location.href =
            "../customerRegistration/login.html";

        return;
    }


    try {

        const response =
            await fetch(
                "https://stonehub-backend-service.onrender.com/api/cart/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        productId:
                            Number(productId),

                        quantity: 1
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Add to cart response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to add product to cart."
            );

        }


        alert(
            data.message ||
            "Product added to cart."
        );

        await updateCartBadge();


    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );


        alert(
            error.message ||
            "Unable to add product to cart."
        );

    }

}

/* ==========================================================
   VIEW DETAILS BUTTON EVENT
========================================================== */

productGrid.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".product-btn[data-product-id]"
            );


        if (!button) {

            return;

        }


        const productId =
            button.dataset.productId;


        if (!productId) {

            return;

        }


        event.preventDefault();


        viewProductDetails(productId);

    }
);


/* ==========================================================
   UPDATE DISPLAYED PRICES
========================================================== */

function updateDisplayedPrices() {

    const priceElements =
        document.querySelectorAll(
            ".product-price"
        );


    priceElements.forEach(
        priceElement => {

            const priceInGHS =
                Number(
                    priceElement.dataset.price
                );


            priceElement.textContent =
                `${formatPrice(priceInGHS)} / sq. ft.`;
        }
    );

}


/* ==========================================================
   CURRENCY SWITCHER
========================================================== */

if (currencySwitcher) {

    currencySwitcher.addEventListener(
        "change",
        function () {

            currentCurrency =
                this.value;

            localStorage.setItem(
                "stoneHubCurrency",
                 currentCurrency
                        );


            updateDisplayedPrices();

        }
    );

}



/* ==========================================================
   SEARCH PRODUCTS
========================================================== */

function searchProducts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        card => {

            const productName =
                card.querySelector("h3")
                    .textContent
                    .toLowerCase();


            const productDescription =
                card.querySelector("p")
                    .textContent
                    .toLowerCase();


            if (
                productName.includes(searchTerm) ||
                productDescription.includes(searchTerm)
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        }
    );

}


/* ==========================================================
   CATEGORY BUTTONS
========================================================== */

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * Remove active state.
                 */

                categoryButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                 * Add active state.
                 */

                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category;


                if (category === "all") {

                    loadProducts();

                    return;

                }


                /*
                 * Category IDs from the
                 * StoneHub database:
                 *
                 * 1 = Granite
                 * 2 = Marble
                 * 3 = Quartz
                 */

                const categoryIds = {

                    granite: 1,
                    marble: 2,
                    quartz: 3

                };


                const categoryId =
                    categoryIds[category];


                if (categoryId) {

                    loadProductsByCategory(
                        categoryId
                    );

                }

            }
        );

    }
);


/* ==========================================================
   SEARCH EVENT
========================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );

}


/* ==========================================================
   LOADING STATE
========================================================== */

function showLoading() {

    productGrid.innerHTML = "";

    loadingMessage.classList.remove(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

}


/* ==========================================================
   ERROR STATE
========================================================== */

function showError() {

    productGrid.innerHTML = "";

    loadingMessage.classList.add(
        "hidden"
    );

    errorMessage.classList.remove(
        "hidden"
    );

}


/* ==========================================================
   HIDE MESSAGES
========================================================== */

function hideMessages() {

    loadingMessage.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

}


/* ==========================================================
   INITIAL LOAD
========================================================== */

async function initializeCatalogue() {

    await Promise.all([
        loadExchangeRates(),
        loadProducts(),
        updateCartBadge()
    ]);

}


/* ==========================================================
   START CATALOGUE
========================================================== */

async function startCatalogue() {

    const productIdFromUrl =
        new URLSearchParams(
            window.location.search
        ).get("productId");


    if (productIdFromUrl) {

        await loadExchangeRates();

        await viewProductDetails(
            productIdFromUrl
        );

    } else {

        await initializeCatalogue();

    }

}


startCatalogue();

