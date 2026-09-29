// =====================================================
// TOP PRODUCTS
// =====================================================

let topProducts = [ ];


let orderStatuses = [];


// =====================================================
// HTML ELEMENTS
// =====================================================

const reportPeriod =
    document.getElementById("reportPeriod");

const totalRevenue =
    document.getElementById("totalRevenue");

const totalOrders =
    document.getElementById("totalOrders");

const totalCustomers =
    document.getElementById("totalCustomers");

const averageOrder =
    document.getElementById("averageOrder");

const newCustomers =
    document.getElementById("newCustomers");

const returningCustomers =
    document.getElementById("returningCustomers");

const activeCustomers =
    document.getElementById("activeCustomers");

const inactiveCustomers =
    document.getElementById("inactiveCustomers");

const topProductsContainer =
    document.getElementById("topProducts");

const orderStatusContainer =
    document.getElementById("orderStatus");

const reportSearch =
    document.getElementById("reportSearch");


// =====================================================
// FORMAT MONEY
// =====================================================

function formatMoney(amount) {

    return `GHâ‚µ ${amount.toLocaleString("en-GH")}`;

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

async function updateSummary(period) {

    try {

        // Get summary data

        const summaryResponse = await fetch(
            `http://localhost:5000/api/admin/reports/summary?days=${period}`
        );


        if (!summaryResponse.ok) {

            throw new Error(
                `Summary HTTP error: ${summaryResponse.status}`
            );

        }


        const summaryData =
            await summaryResponse.json();


        // Get customer overview data

        const customerResponse = await fetch(
            `http://localhost:5000/api/admin/reports/customers?days=${period}`
        );


        if (!customerResponse.ok) {

            throw new Error(
                `Customer HTTP error: ${customerResponse.status}`
            );

        }


        const customerData =
            await customerResponse.json();


        // Update summary cards

        totalRevenue.textContent =
            formatMoney(
                Number(summaryData.totalRevenue)
            );


        totalOrders.textContent =
            Number(
                summaryData.totalOrders
            ).toLocaleString();


        totalCustomers.textContent =
            Number(
                summaryData.totalCustomers
            ).toLocaleString();


        averageOrder.textContent =
            formatMoney(
                Math.round(
                    Number(summaryData.averageOrder)
                )
            );


        // Update customer overview

        newCustomers.textContent =
            Number(
                customerData.newCustomers
            ).toLocaleString();


        returningCustomers.textContent =
            Number(
                customerData.returningCustomers
            ).toLocaleString();


        activeCustomers.textContent =
            Number(
                customerData.activeCustomers
            ).toLocaleString();


        inactiveCustomers.textContent =
            Number(
                customerData.inactiveCustomers
            ).toLocaleString();

                // Get order status data

        const orderStatusResponse = await fetch(
            `http://localhost:5000/api/admin/reports/orders/status?days=${period}`
        );

                // Get top products

        const topProductsResponse = await fetch(
            `http://localhost:5000/api/admin/reports/products/top?days=${period}`
        );


        if (!topProductsResponse.ok) {

            throw new Error(
                `Top products HTTP error: ${topProductsResponse.status}`
            );

        }


        topProducts =
            await topProductsResponse.json();


        displayTopProducts();

                // Get sales overview data

        const salesResponse = await fetch(
            `http://localhost:5000/api/admin/reports/sales?days=${period}`
        );


        if (!salesResponse.ok) {

            throw new Error(
                `Sales overview HTTP error: ${salesResponse.status}`
            );

        }


        salesData =
            await salesResponse.json();


        displaySalesChart();

        if (!orderStatusResponse.ok) {

            throw new Error(
                `Order status HTTP error: ${orderStatusResponse.status}`
            );

        }


        orderStatuses =
            await orderStatusResponse.json();


        displayOrderStatus();    


    } catch (error) {

        console.error(
            "Error loading report:",
            error
        );

    }

}



// =====================================================
// DISPLAY TOP PRODUCTS
// =====================================================

function displayTopProducts() {

    topProductsContainer.innerHTML = "";


    topProducts.forEach((product, index) => {

        const item =
            document.createElement("div");

        item.className =
            "report-list-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${index + 1}. ${product.name}
                </strong>

                <span>
                    ${product.sales} sales
                </span>

            </div>


            <strong>
                ${formatMoney(product.revenue)}
            </strong>

        `;


        topProductsContainer.appendChild(item);

    });

}


// =====================================================
// DISPLAY ORDER STATUS
// =====================================================

function displayOrderStatus() {

    orderStatusContainer.innerHTML = "";


    orderStatuses.forEach(order => {

        const item =
            document.createElement("div");

        item.className =
            "report-list-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${order.status}
                </strong>

            </div>


            <strong>
                ${order.count}
            </strong>

        `;


        orderStatusContainer.appendChild(item);

    });

}


// =====================================================
// PERIOD CHANGE
// =====================================================

reportPeriod.addEventListener(
    "change",
    function () {

        const selectedPeriod =
            reportPeriod.value;


        updateSummary(selectedPeriod);

    }
);


// =====================================================
// REPORT SEARCH
// =====================================================

reportSearch.addEventListener(
    "input",
    function () {

        const searchTerm =
            reportSearch.value
                .toLowerCase()
                .trim();


        const productItems =
            document.querySelectorAll(
                "#topProducts .report-list-item"
            );


        productItems.forEach(item => {

            const text =
                item.textContent.toLowerCase();


            if (text.includes(searchTerm)) {

                item.style.display = "";

            } else {

                item.style.display = "none";

            }

        });

    }
);


// =====================================================
// INITIALIZE REPORT
// =====================================================

updateSummary("30");

displayTopProducts();

displayOrderStatus();

// =====================================================
// SALES CHART
// =====================================================

let salesData = [];



function displaySalesChart() {

    const chart =
        document.getElementById("salesChart");


    chart.innerHTML = `

        <div class="sales-chart-wrapper">

            <div class="sales-chart-y">

                <span>GHâ‚µ 8k</span>
                <span>GHâ‚µ 6k</span>
                <span>GHâ‚µ 4k</span>
                <span>GHâ‚µ 2k</span>
                <span>GHâ‚µ 0</span>

            </div>


            <div class="sales-chart-area">

                <div class="chart-grid">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                <div class="chart-bars">

                    ${salesData.map(day => `

                        <div class="chart-column">

                            <div
                                class="chart-bar"
                                style="height: ${
                                    (day.revenue / 8000) * 100
                                }%;"
                               title="${new Date(day.date).toLocaleDateString(
                                    "en-GH",
                                    {
                                        month: "short",
                                        day: "numeric"
                                    }
                                )}: GHâ‚µ ${Number(day.revenue).toLocaleString("en-GH")}"
                            ></div>

                            <span class="chart-label">
                                ${new Date(day.date).toLocaleDateString(
                                        "en-GH",
                                                {
                                        month: "short",
                                        day: "numeric"
                                    }
                                )}
                            </span>

                        </div>

                    `).join("")}

                </div>

            </div>

        </div>

    `;

}


displaySalesChart();



