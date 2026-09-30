/* =========================================================
   STONEHUB ADMIN DASHBOARD
   FRONTEND JAVASCRIPT
   ========================================================= */


// =========================================================
// 1. HTML ELEMENTS
// =========================================================

const sidebar = document.querySelector(".sidebar");

const menuButton = document.querySelector(".menu-button");

const notificationButton =
    document.querySelector(".notification-button");

const navItems =
    document.querySelectorAll(".nav-item");


// =========================================================
// 2. MOBILE SIDEBAR
// =========================================================

if (menuButton) {

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("sidebar-open");

    });

}


// =========================================================
// 3. SIDEBAR NAVIGATION
// =========================================================

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (navItem) {

            navItem.classList.remove("active");

        });

        item.classList.add("active");

        if (sidebar) {

            sidebar.classList.remove("sidebar-open");

        }

    });

});


// =========================================================
// 4. NOTIFICATIONS
// =========================================================

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        function () {

            alert("You have no new notifications.");

        }
    );

}


// =========================================================
// 5. BACKEND API
// =========================================================

const API_URL =
    "https://stonehub-backend-service.onrender.com/api/admin/dashboard";


// =========================================================
// 6. GET ADMIN TOKEN
// =========================================================

function getAdminToken() {

    return localStorage.getItem("adminToken");

}


// =========================================================
// 7. COMMON REQUEST HEADERS
// =========================================================

function getHeaders() {

    const token = getAdminToken();

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}


// =========================================================
// 8. DASHBOARD STATISTICS
// =========================================================

async function loadDashboardStats() {

    try {

        const response = await fetch(
            `${API_URL}/stats`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard statistics"
            );

        }


        const data = await response.json();


        console.log(
            "Dashboard statistics:",
            data
        );


        const statCards =
            document.querySelectorAll(".stat-card");


        if (statCards.length >= 4) {

            // Sales

            statCards[0]
                .querySelector("h3")
                .textContent =
                `GHâ‚µ ${Number(data.sales)
                    .toLocaleString()}`;


            // Orders

            statCards[1]
                .querySelector("h3")
                .textContent =
                data.orders;


            // Customers

            statCards[2]
                .querySelector("h3")
                .textContent =
                data.customers;


            // Products

            statCards[3]
                .querySelector("h3")
                .textContent =
                data.products;

        }

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );

    }

}


// =========================================================
// 9. RECENT ORDERS
// =========================================================

async function loadRecentOrders() {

    try {

        const response = await fetch(
            `${API_URL}/recent-orders`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load recent orders"
            );

        }


        const orders =
            await response.json();


        console.log(
            "Recent orders:",
            orders
        );


        const tableBody =
            document.querySelector("#ordersTableBody");


        if (!tableBody) {

            return;

        }


        tableBody.innerHTML = "";


        orders.forEach(function (order) {

            const row =
                document.createElement("tr");


            let statusClass = "";


            if (order.order_status === "Delivered") {

                statusClass = "completed";

            } else if (
                order.order_status === "Pending"
            ) {

                statusClass = "pending";

            } else if (
                order.order_status === "Cancelled"
            ) {

                statusClass = "cancelled";

            } else {

                statusClass = "pending";

            }


            row.innerHTML = `

                <td>#${order.order_id}</td>

                <td>
                    ${order.customer_name}
                </td>

                <td>
                    GHâ‚µ ${Number(
                        order.total_amount
                    ).toLocaleString()}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${order.order_status}
                    </span>
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Recent orders error:",
            error
        );

    }

}


// =========================================================
// 10. RECENT CUSTOMERS
// =========================================================

async function loadRecentCustomers() {

    try {

        const response = await fetch(
            `${API_URL}/recent-customers`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load recent customers"
            );

        }


        const customers =
            await response.json();


        console.log(
            "Recent customers:",
            customers
        );


        const customerList =
            document.querySelector("#customerList");


        if (!customerList) {

            return;

        }


        customerList.innerHTML = "";


        customers.forEach(function (customer) {

            const customerElement =
                document.createElement("div");


            customerElement.className =
                "customer-item";


            const firstLetter =
                customer.first_name
                    .charAt(0)
                    .toUpperCase();


            customerElement.innerHTML = `

                <div class="customer-avatar">
                    ${firstLetter}
                </div>

                <div class="customer-details">

                    <strong>
                        ${customer.first_name}
                        ${customer.last_name}
                    </strong>

                    <span>
                        ${customer.email}
                    </span>

                </div>

            `;


            customerList.appendChild(
                customerElement
            );

        });


    } catch (error) {

        console.error(
            "Recent customers error:",
            error
        );

    }

}


// =========================================================
// 11. LOW STOCK PRODUCTS
// =========================================================

async function loadLowStockProducts() {

    try {

        const response = await fetch(
            `${API_URL}/low-stock`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load low stock products"
            );

        }


        const products =
            await response.json();


        console.log(
            "Low stock products:",
            products
        );


        const stockList =
            document.querySelector("#stockList");


        if (!stockList) {

            return;

        }


        stockList.innerHTML = "";


        products.forEach(function (product) {

            const productElement =
                document.createElement("div");


            productElement.className =
                "stock-item";


            productElement.innerHTML = `

                <div class="stock-product">

                    <strong>
                        ${product.product_name}
                    </strong>

                    <span>
                        Inventory warning
                    </span>

                </div>

                <span class="stock-count">
                    ${product.stock_quantity} left
                </span>

            `;


            stockList.appendChild(
                productElement
            );

        });


    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

    }

}


// =========================================================
// 12. SALES DATA
// =========================================================

async function loadSalesData() {

    try {

        const response = await fetch(
            `${API_URL}/sales`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load sales data"
            );

        }


        const sales =
            await response.json();


        console.log(
            "Sales data:",
            sales
        );


        drawSalesChart(sales);


    } catch (error) {

        console.error(
            "Sales data error:",
            error
        );

    }

}


// =========================================================
// 13. DRAW SALES CHART
// =========================================================

function drawSalesChart(sales) {

    const canvas =
        document.querySelector("#salesChart");


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        canvas.parentElement.clientWidth;


    canvas.height =
        canvas.parentElement.clientHeight;


    const width =
        canvas.width;


    const height =
        canvas.height;


    if (sales.length === 0) {

        ctx.fillStyle = "#6b7280";

        ctx.font = "14px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "No sales data available",
            width / 2,
            height / 2
        );

        return;

    }


    const values =
        sales.map(function (item) {

            return Number(
                item.total_sales
            );

        });


    const maxValue =
        Math.max(...values, 1);


    const padding = 30;


    const chartWidth =
        width - padding * 2;


    const chartHeight =
        height - padding * 2;


    const stepX =
        sales.length > 1
            ? chartWidth / (sales.length - 1)
            : chartWidth / 2;


    // Draw line

    ctx.beginPath();


    values.forEach(function (
        value,
        index
    ) {

        const x =
            sales.length === 1
                ? width / 2
                : padding +
                  index * stepX;


        const y =
            height -
            padding -
            (value / maxValue) *
            chartHeight;


        if (index === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }

    });


    ctx.strokeStyle = "#2563eb";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Draw points

    values.forEach(function (
        value,
        index
    ) {

        const x =
            sales.length === 1
                ? width / 2
                : padding +
                  index * stepX;


        const y =
            height -
            padding -
            (value / maxValue) *
            chartHeight;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            5,
            0,
            Math.PI * 2
        );


        ctx.fillStyle = "#2563eb";

        ctx.fill();

    });


    // Draw date labels

    ctx.fillStyle = "#6b7280";

    ctx.font = "12px Arial";

    ctx.textAlign = "center";


    sales.forEach(function (
        item,
        index
    ) {

        const x =
            sales.length === 1
                ? width / 2
                : padding +
                  index * stepX;


        const date =
            new Date(item.sale_date);


        const label =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        ctx.fillText(
            label,
            x,
            height - 8
        );

    });

}


// =========================================================
// 14. LOAD ENTIRE DASHBOARD
// =========================================================

async function loadDashboard() {

    await Promise.all([

        loadDashboardStats(),

        loadRecentOrders(),

        loadRecentCustomers(),

        loadLowStockProducts(),

        loadSalesData()

    ]);

}


// =========================================================
// 15. START DASHBOARD
// =========================================================

loadDashboard();
