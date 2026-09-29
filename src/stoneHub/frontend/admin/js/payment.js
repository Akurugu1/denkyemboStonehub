// =====================================================
// PAYMENT DATA
// =====================================================

let payments = [];


// =====================================================
// HTML ELEMENTS
// =====================================================

const tableBody =
    document.getElementById("paymentsTableBody");

const searchInput =
    document.getElementById("paymentSearch");

const filterButtons =
    document.querySelectorAll(".customer-filter");

const paymentModal =
    document.getElementById("paymentModal");

const totalRevenue = 
    document.getElementById("totalRevenue");

const paidCount = 
    document.getElementById("paidCount");

const pendingCount =
    document.getElementById("pendingCount");

const failedCount =
    document.getElementById("failedCount");


const paymentDetails =
    document.getElementById("paymentDetails");

const closePaymentModal =
    document.getElementById("closePaymentModal");


// =====================================================
// FORMAT MONEY
// =====================================================

function formatMoney(amount) {

    return `GHâ‚µ ${Number(amount).toLocaleString("en-GH")}`;

}


// =====================================================
// FORMAT TRANSACTION ID
// =====================================================

function formatTransactionId(paymentId) {

    return `PAY-${String(paymentId).padStart(5, "0")}`;

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date) {

    const paymentDate = new Date(date);

    return paymentDate.toLocaleDateString(
        "en-GH",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// =====================================================
// FETCH PAYMENTS FROM BACKEND
// =====================================================

async function fetchPayments() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/payments"
        );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data = await response.json();


        // Convert backend data into the format
        // used by this JavaScript file

        payments = data.map(payment => {

            return {

                id: payment.payment_id,

                transactionId:
                    formatTransactionId(
                        payment.payment_id
                    ),

                customer:
                    payment.customer,

                amount:
                    Number(payment.amount),

                method:
                    payment.payment_method,

                date:
                    formatDate(payment.order_date),

                status:
                    payment.payment_status

            };

        });

        const revenue = payments
            .filter(payment => payment.status === "Paid")
            .reduce((total, payment) => total + payment.amount, 0);

        totalRevenue.textContent = formatMoney(revenue);

        const paidPayments = payments
            .filter(payment => payment.status === "Paid");

        paidCount.textContent = paidPayments.length;

        const pendingPayments = payments
            .filter(payment => payment.status === "Pending");

            pendingCount.textContent = pendingPayments.length;


        const failedPayments = payments
            .filter(payment => payment.status === "Failed");

            failedCount.textContent = failedPayments.length;

        displayPayments(payments);


    } catch (error) {

        console.error(
            "Error loading payments:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align: center;"
                >
                    Failed to load payments.
                </td>

            </tr>

        `;

    }

}


// =====================================================
// DISPLAY PAYMENTS
// =====================================================

function displayPayments(paymentList) {

    tableBody.innerHTML = "";


    // No payments found

    if (paymentList.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align: center;"
                >
                    No payments found.
                </td>

            </tr>

        `;

        return;

    }


    // Display payments

    paymentList.forEach(payment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${payment.transactionId}
            </td>


            <td>
                ${payment.customer}
            </td>


            <td>
                ${formatMoney(payment.amount)}
            </td>


            <td>
                ${payment.method}
            </td>


            <td>
                ${payment.date}
            </td>


            <td>
                ${payment.status}
            </td>


            <td>

                <button
                    type="button"
                    class="view-payment"
                    data-id="${payment.id}"
                >
                    View
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// =====================================================
// SEARCH PAYMENTS
// =====================================================

searchInput.addEventListener(
    "input",
    function () {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredPayments =
            payments.filter(payment => {

                return (

                    payment.transactionId
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    payment.customer
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    payment.method
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    payment.status
                        .toLowerCase()
                        .includes(searchTerm)

                );

            });


        displayPayments(filteredPayments);

    }
);


// =====================================================
// FILTER PAYMENTS
// =====================================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {


            // Remove active class

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            // Add active class

            button.classList.add("active");


            const selectedStatus =
                button.dataset.status;


            // Show all

            if (selectedStatus === "All") {

                displayPayments(payments);

                return;

            }


            // Filter payments

            const filteredPayments =
                payments.filter(payment => {

                    return (
                        payment.status === selectedStatus
                    );

                });


            displayPayments(filteredPayments);

        }
    );

});


// =====================================================
// VIEW PAYMENT DETAILS
// =====================================================

tableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".view-payment");


        if (!button) {

            return;

        }


        const paymentId =
            Number(button.dataset.id);


        const payment =
            payments.find(
                item => item.id === paymentId
            );


        if (!payment) {

            return;

        }


        paymentDetails.innerHTML = `

            <div class="payment-details">

                <p>

                    <strong>
                        Transaction ID:
                    </strong>

                    ${payment.transactionId}

                </p>


                <p>

                    <strong>
                        Customer:
                    </strong>

                    ${payment.customer}

                </p>


                <p>

                    <strong>
                        Amount:
                    </strong>

                    ${formatMoney(payment.amount)}

                </p>


                <p>

                    <strong>
                        Payment Method:
                    </strong>

                    ${payment.method}

                </p>


                <p>

                    <strong>
                        Date:
                    </strong>

                    ${payment.date}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    ${payment.status}

                </p>

            </div>

        `;


        paymentModal.classList.add("active");

    }
);


// =====================================================
// CLOSE PAYMENT MODAL
// =====================================================

closePaymentModal.addEventListener(
    "click",
    function () {

        paymentModal.classList.remove("active");

    }
);


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

paymentModal.addEventListener(
    "click",
    function (event) {

        if (event.target === paymentModal) {

            paymentModal.classList.remove("active");

        }

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

fetchPayments();