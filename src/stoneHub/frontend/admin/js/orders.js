/* =========================================================
   STONEHUB ORDERS
   ========================================================= */


/* =========================================================
   1. ORDER DATA
   ========================================================= */

let orders = [];


/* =========================================================
   2. LOAD ORDERS FROM DATABASE
   ========================================================= */

async function loadOrders() {

    try {

        const adminToken =
            localStorage.getItem("adminToken");


        if (!adminToken) {

            throw new Error(
                "No admin token found."
            );

        }


        const response =
            await fetch(
                "https://stonehub-backend-service.onrender.com/api/orders",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        orders =
            data.orders.map(function (order) {

                return {

                    id:
                        `#SH${String(
                            order.order_id
                        ).padStart(4, "0")}`,

                    customer: {

                        name:
                            order.customer_name,

                        email:
                            order.customer_email || ""

                    },

                    total:
                        Number(order.total_amount),

                    date:
                        new Date(
                            order.order_date
                        ).toLocaleDateString(
                            "en-GH",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        ),

                    status:
                        order.order_status

                };

            });


        applyFilters();


    }

    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersManagementBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >
                    Failed to load orders.
                </td>

            </tr>

        `;

    }

}


/* =========================================================
   3. GET ELEMENTS
   ========================================================= */

const ordersManagementBody =
    document.querySelector("#ordersManagementBody");


const orderSearch =
    document.querySelector("#orderSearch");


const filterButtons =
    document.querySelectorAll(".filter-button");


const orderModal =
    document.querySelector("#orderModal");


const closeOrderModal =
    document.querySelector("#closeOrderModal");


const orderDetails =
    document.querySelector("#orderDetails");


let currentStatus = "All";


/* =========================================================
   4. RENDER ORDERS
   ========================================================= */

function renderOrders(
    orderList = orders
) {

    ordersManagementBody.innerHTML = "";


    if (orderList.length === 0) {

        ordersManagementBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >
                    No orders found.
                </td>

            </tr>

        `;

        return;

    }


    orderList.forEach(function (order) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="order-id">
                    ${order.id}
                </span>

            </td>


            <td>

                <div class="order-customer">

                    <strong>
                        ${order.customer.name}
                    </strong>

                    <span>
                        ${order.customer.email}
                    </span>

                </div>

            </td>


            <td>
                â€”
            </td>


            <td>
                GHC ${order.total.toFixed(2)}
            </td>


            <td>
                ${order.date}
            </td>


            <td>

                <select
                    class="status-select"
                    onchange="changeOrderStatus(
                        '${order.id}',
                        this.value
                    )"
                >

                    <option
                        value="Pending"
                        ${
                            order.status === "Pending"
                                ? "selected"
                                : ""
                        }
                    >
                        Pending
                    </option>


                    <option
                        value="Processing"
                        ${
                            order.status === "Processing"
                                ? "selected"
                                : ""
                        }
                    >
                        Processing
                    </option>


                    <option
                        value="Shipped"
                        ${
                            order.status === "Shipped"
                                ? "selected"
                                : ""
                        }
                    >
                        Shipped
                    </option>


                    <option
                        value="Delivered"
                        ${
                            order.status === "Delivered"
                                ? "selected"
                                : ""
                        }
                    >
                        Delivered
                    </option>


                    <option
                        value="Cancelled"
                        ${
                            order.status === "Cancelled"
                                ? "selected"
                                : ""
                        }
                    >
                        Cancelled
                    </option>

                </select>

            </td>


            <td>

                <button
                    class="view-button"
                    onclick="viewOrder('${order.id}')"
                >
                    View
                </button>

            </td>

        `;


        ordersManagementBody.appendChild(row);

    });

}


/* =========================================================
   5. CHANGE ORDER STATUS
   ========================================================= */

async function changeOrderStatus(
    orderId,
    newStatus
) {

    try {

        const adminToken =
            localStorage.getItem("adminToken");


        if (!adminToken) {

            throw new Error(
                "No admin token found."
            );

        }


        const numericOrderId =
            parseInt(
                orderId.replace("#SH", ""),
                10
            );


        const response =
            await fetch(
                `https://stonehub-backend-service.onrender.com/api/orders/status/${numericOrderId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${adminToken}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })

                }
            );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                `HTTP error: ${response.status}`
            );

        }


        const order =
            orders.find(function (order) {

                return order.id === orderId;

            });


        if (order) {

            order.status =
                newStatus;

        }


        applyFilters();


        console.log(
            "Order status updated successfully."
        );


    }

    catch (error) {

        console.error(
            "Error updating order status:",
            error
        );


        alert(
            "Failed to update order status."
        );


        loadOrders();

    }

}


/* =========================================================
   6. VIEW ORDER DETAILS
   ========================================================= */

async function viewOrder(
    orderId
) {

    try {

        const adminToken =
            localStorage.getItem("adminToken");


        if (!adminToken) {

            throw new Error(
                "No admin token found."
            );

        }


        const numericOrderId =
            parseInt(
                orderId.replace("#SH", ""),
                10
            );


        const response =
            await fetch(
                `https://stonehub-backend-service.onrender.com/api/orders/${numericOrderId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                "Failed to retrieve order."
            );

        }


        const order =
            await response.json();


        let itemsHTML = "";


        if (
            order.items &&
            order.items.length > 0
        ) {

            order.items.forEach(
                function (item) {

                    const itemTotal =
                        Number(item.quantity) *
                        Number(item.price);


                    itemsHTML += `

                        <div class="order-item">

                            <div class="order-item-info">

                                <strong>
                                    ${item.name}
                                </strong>

                                <span>
                                    ${item.quantity} Ã—
                                    GHC ${Number(
                                        item.price
                                    ).toFixed(2)}
                                </span>

                            </div>


                            <strong>
                                GHC ${itemTotal.toFixed(2)}
                            </strong>

                        </div>

                    `;

                }
            );

        }

        else {

            itemsHTML = `

                <p>
                    No items found for this order.
                </p>

            `;

        }


        orderDetails.innerHTML = `

            <div class="order-info-grid">

                <div class="order-info-box">

                    <span>
                        Order ID
                    </span>

                    <strong>
                        #SH${String(
                            order.order_id
                        ).padStart(4, "0")}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${new Date(
                            order.order_date
                        ).toLocaleDateString(
                            "en-GB",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${order.customer_name}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${order.customer_email}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${order.order_status}
                    </strong>

                </div>

            </div>


            <div class="order-items">

                <h4>
                    Order Items
                </h4>


                ${itemsHTML}


                <div class="order-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        GHC ${Number(
                            order.total_amount
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>

        `;


        orderModal.classList.add("show");


    }

    catch (error) {

        console.error(
            "Error retrieving order:",
            error
        );


        alert(
            "Failed to load order details."
        );

    }

}


/* =========================================================
   7. CLOSE ORDER MODAL
   ========================================================= */

function closeOrderDetails() {

    orderModal.classList.remove("show");

}


closeOrderModal.addEventListener(
    "click",
    closeOrderDetails
);


orderModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === orderModal
        ) {

            closeOrderDetails();

        }

    }
);


/* =========================================================
   8. SEARCH + FILTER
   ========================================================= */

function applyFilters() {

    const searchTerm =
        orderSearch.value
            .toLowerCase()
            .trim();


    const filteredOrders =
        orders.filter(function (order) {

            const matchesSearch =

                order.id
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                order.customer.name
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                order.customer.email
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesStatus =

                currentStatus === "All"

                ||

                order.status === currentStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderOrders(
        filteredOrders
    );

}


/* =========================================================
   9. SEARCH EVENT
   ========================================================= */

orderSearch.addEventListener(
    "input",
    applyFilters
);


/* =========================================================
   10. STATUS FILTER BUTTONS
   ========================================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (filterButton) {

                        filterButton.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentStatus =
                    button.dataset.status;


                applyFilters();

            }
        );

    }
);


/* =========================================================
   11. INITIAL LOAD
   ========================================================= */

loadOrders();
