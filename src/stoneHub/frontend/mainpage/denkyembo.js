document.addEventListener("DOMContentLoaded", () => {


    /* ==========================================================
       HEADER SHADOW
    ========================================================== */

    const header =
        document.querySelector(".header");


    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 80) {

                header.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.10)";

            } else {

                header.style.boxShadow =
                    "0 2px 10px rgba(0, 0, 0, 0.05)";

            }

        });

    }



    /* ==========================================================
       SMOOTH SCROLL
    ========================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(targetId);


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const navbarHeight = 70;


                    const position =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        navbarHeight;


                    window.scrollTo({

                        top: position,

                        behavior: "smooth"

                    });

                }
            );

        });



    /* ==========================================================
       QUANTITY CALCULATOR
    ========================================================== */

    const calculatorBtn =
        document.getElementById(
            "calculatorBtn"
        );


    const calculatorDropdown =
        document.getElementById(
            "calculatorDropdown"
        );


    const calculatorClose =
        document.getElementById(
            "calculatorClose"
        );


    const calculateButton =
        document.getElementById(
            "calculateQuantity"
        );


    const calculatorResult =
        document.getElementById(
            "calculatorResult"
        );


    const lengthInput =
        document.getElementById(
            "length"
        );


    const widthInput =
        document.getElementById(
            "width"
        );


    const slabSize =
        document.getElementById(
            "slabSize"
        );



    /* ==========================================================
       CHECK CALCULATOR ELEMENTS
    ========================================================== */

    if (
        !calculatorBtn ||
        !calculatorDropdown ||
        !calculatorClose ||
        !calculateButton ||
        !calculatorResult ||
        !lengthInput ||
        !widthInput ||
        !slabSize
    ) {

        console.error(
            "Quantity calculator elements are missing from the HTML."
        );

    } else {


        /* ======================================================
           OPEN CALCULATOR
        ====================================================== */

        calculatorBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                calculatorDropdown.classList.toggle(
                    "show"
                );

            }
        );



        /* ======================================================
           CLOSE CALCULATOR
        ====================================================== */

        calculatorClose.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                calculatorDropdown.classList.remove(
                    "show"
                );

            }
        );



        /* ======================================================
           PREVENT CLICK INSIDE FROM CLOSING
        ====================================================== */

        calculatorDropdown.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );



        /* ======================================================
           CLOSE WHEN CLICKING OUTSIDE
        ====================================================== */

        document.addEventListener(
            "click",
            () => {

                calculatorDropdown.classList.remove(
                    "show"
                );

            }
        );



        /* ======================================================
           CALCULATE SLABS
        ====================================================== */

        calculateButton.addEventListener(
            "click",
            () => {


                const length =
                    parseFloat(
                        lengthInput.value
                    );


                const width =
                    parseFloat(
                        widthInput.value
                    );


                const selectedSlabArea =
                    parseFloat(
                        slabSize.value
                    );



                /* ==============================================
                   VALIDATION
                ============================================== */

                if (
                    !Number.isFinite(length) ||
                    !Number.isFinite(width) ||
                    !Number.isFinite(
                        selectedSlabArea
                    ) ||
                    length <= 0 ||
                    width <= 0 ||
                    selectedSlabArea <= 0
                ) {

                    calculatorResult.innerHTML = `

                        <strong>
                            Please complete all fields.
                        </strong>

                        <br>

                        Enter a valid length,
                        width and slab size.

                    `;


                    calculatorResult.classList.add(
                        "show"
                    );


                    return;

                }



                /* ==============================================
                   AREA
                ============================================== */

                const requiredArea =
                    length * width;



                /* ==============================================
                   BASIC SLABS
                ============================================== */

                const slabsRequired =
                    Math.ceil(
                        requiredArea /
                        selectedSlabArea
                    );



                /* ==============================================
                   10% WASTAGE
                ============================================== */

                const areaWithWastage =
                    requiredArea * 1.10;


                const recommendedSlabs =
                    Math.ceil(
                        areaWithWastage /
                        selectedSlabArea
                    );



                /* ==============================================
                   DISPLAY RESULT
                ============================================== */

                calculatorResult.innerHTML = `

                    <strong>
                        Required area:
                    </strong>

                    ${requiredArea.toFixed(2)} mÂ²

                    <br>

                    <strong>
                        Slab area:
                    </strong>

                    ${selectedSlabArea.toFixed(2)} mÂ²

                    <br>

                    <strong>
                        Slabs required:
                    </strong>

                    ${slabsRequired}

                    <br>

                    <strong>
                        Recommended:
                    </strong>

                    ${recommendedSlabs} slabs

                    <br><br>

                    <small>

                        The recommended quantity includes
                        approximately 10% allowance for
                        cutting and wastage.

                    </small>

                `;


                calculatorResult.classList.add(
                    "show"
                );

            }
        );



        /* ======================================================
           ENTER KEY SUPPORT
        ====================================================== */

        [
            lengthInput,
            widthInput
        ].forEach(input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateButton.click();

                    }

                }
            );

        });

    }



    /* ==========================================================
       CART QUANTITY
    ========================================================== */

    function updateCartBadge() {

        const cartBadge =
            document.getElementById(
                "cartBadge"
            );


        if (!cartBadge) {
            return;
        }


        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


        } catch (error) {

            console.error(
                "Unable to read cart:",
                error
            );


            cart = [];

        }



        /* ======================================================
           CALCULATE TOTAL QUANTITY
        ====================================================== */

        const totalQuantity =
            cart.reduce(
                (total, item) => {

                    return total +
                        (
                            Number(
                                item.quantity
                            ) || 0
                        );

                },
                0
            );



        /* ======================================================
           UPDATE BADGE
        ====================================================== */

        cartBadge.textContent =
            totalQuantity;



        /* ======================================================
           SHOW / HIDE BADGE
        ====================================================== */

        if (totalQuantity > 0) {

            cartBadge.style.display =
                "flex";

        } else {

            cartBadge.style.display =
                "none";

        }

    }



    /* ==========================================================
       UPDATE CART WHEN ANOTHER PAGE CHANGES IT
    ========================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === "cart"
            ) {

                updateCartBadge();

            }

        }
    );



    /* ==========================================================
       CURRENCY
    ========================================================== */

    let currentCurrency =
        localStorage.getItem(
            "stoneHubCurrency"
        ) || "GHS";


    let exchangeRates = {

        GHS: 1,

        USD: 0,

        EUR: 0

    };


    const currencySwitcher =
        document.querySelector(
            ".currency-switcher"
        );


    if (currencySwitcher) {

        currencySwitcher.value =
            currentCurrency;


        if (
            currencySwitcher.value !==
            currentCurrency
        ) {

            currentCurrency =
                "GHS";


            currencySwitcher.value =
                "GHS";


            localStorage.setItem(
                "stoneHubCurrency",
                "GHS"
            );

        }

    }



    /* ==========================================================
       FORMAT PRICE
    ========================================================== */

    function formatCollectionPrice(price) {

        const rate =
            Number(
                exchangeRates[
                    currentCurrency
                ]
            ) || 1;


        const convertedPrice =
            Number(price) * rate;


        const symbols = {

            GHS: "GHâ‚µ",

            USD: "$",

            EUR: "â‚¬"

        };


        const symbol =
            symbols[
                currentCurrency
            ] ||
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
       UPDATE DISPLAYED PRICES
    ========================================================== */

    function updateDisplayedCollectionPrices() {

        document
            .querySelectorAll(
                ".collection-price"
            )
            .forEach(element => {

                const price =
                    Number(
                        element.dataset.price
                    ) || 0;


                element.textContent =
                    formatCollectionPrice(
                        price
                    );

            });

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


                updateDisplayedCollectionPrices();

            }
        );

    }



    /* ==========================================================
       LOAD EXCHANGE RATES
    ========================================================== */

    async function loadExchangeRates() {

        try {

            const response =
                await fetch(
                    "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=GHS,USD"
                );


            if (!response.ok) {

                throw new Error(
                    "Exchange rate request failed."
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
                    "Required exchange rates unavailable."
                );

            }


            exchangeRates.GHS =
                1;


            exchangeRates.USD =
                eurToUSD.rate /
                eurToGHS.rate;


            exchangeRates.EUR =
                1 /
                eurToGHS.rate;


            updateDisplayedCollectionPrices();


        } catch (error) {

            console.error(
                "Exchange rate error:",
                error
            );


            exchangeRates = {

                GHS: 1,

                USD: 0,

                EUR: 0

            };

        }

    }



    /* ==========================================================
       LOAD PRODUCTS
    ========================================================== */

    const productContainer =
        document.getElementById(
            "product-container"
        );



    async function loadProducts() {

        if (!productContainer) {
            return;
        }


        try {

            const response =
                await fetch(
                    "https://stonehub-backend-service.onrender.com/api/products"
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const products =
                await response.json();


            productContainer.innerHTML =
                "";



            products.forEach(product => {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "collection-card";


                const price =
                    Number(
                        product.price
                    ) || 0;


                let imageUrl =
                    "images/placeholder.jpg";


                if (
                    product.image_url
                ) {

                    if (
                        product.image_url.startsWith(
                            "http"
                        )
                    ) {

                        imageUrl =
                            product.image_url;

                    } else {

                        imageUrl =
                            `https://stonehub-backend-service.onrender.com${product.image_url}`;

                    }

                }



                card.innerHTML = `

                    <img
                        src="${imageUrl}"
                        alt="${
                            product.product_name ||
                            "Stone product"
                        }"
                    >


                    <div class="overlay">


                        <h3>

                            ${
                                product.product_name ||
                                "Stone"
                            }

                        </h3>


                        <p>

                            ${
                                product.description ||
                                ""
                            }

                        </p>


                        <p>

                            <strong
                                class="collection-price"
                                data-price="${price}">

                                ${
                                    formatCollectionPrice(
                                        price
                                    )
                                }

                            </strong>

                        </p>


                        <a
                            href="catalogue/catalogue.html"
                            class="collection-btn">

                            Explore

                            <i
                                class="fa-solid fa-arrow-right">
                            </i>

                        </a>

                    </div>

                `;


                productContainer.appendChild(
                    card
                );

            });


            activateReveal();


            updateDisplayedCollectionPrices();


        } catch (error) {

            console.error(
                "Product loading error:",
                error
            );


            productContainer.innerHTML = `

                <p class="product-error">

                    Unable to load products
                    at the moment.

                </p>

            `;

        }

    }



    /* ==========================================================
       SCROLL REVEAL
    ========================================================== */

    function activateReveal() {

        const reveal = () => {

            const elements =
                document.querySelectorAll(
                    ".collection-card, .why-card, .testimonial-card"
                );


            const trigger =
                window.innerHeight * 0.85;


            elements.forEach(element => {

                if (
                    element.getBoundingClientRect()
                        .top < trigger
                ) {

                    element.classList.add(
                        "show"
                    );

                }

            });

        };


        window.addEventListener(
            "scroll",
            reveal
        );


        reveal();

    }



    /* ==========================================================
       START
    ========================================================== */

    updateCartBadge();

    loadProducts();

    loadExchangeRates();

});
