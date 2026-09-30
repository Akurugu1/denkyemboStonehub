/* =========================================================
   STONEHUB CUSTOMERS
   ========================================================= */


/* =========================================================
   1. CUSTOMER DATA
   ========================================================= */

let customers = [];


/* =========================================================
   2. GET HTML ELEMENTS
   ========================================================= */

const customersTableBody =
    document.querySelector("#customersTableBody");


const customerSearch =
    document.querySelector("#customerSearch");


const customerFilters =
    document.querySelectorAll(".customer-filter");


const customerModal =
    document.querySelector("#customerModal");


const customerDetails =
    document.querySelector("#customerDetails");


const closeCustomerModal =
    document.querySelector("#closeCustomerModal");


const editCustomerModal =
    document.querySelector("#editCustomerModal");


const closeEditCustomerModal =
    document.querySelector("#closeEditCustomerModal");


const cancelCustomerEdit =
    document.querySelector("#cancelCustomerEdit");


const customerForm =
    document.querySelector("#customerForm");


let currentCustomerStatus = "All";

let editingCustomerId = null;


/* =========================================================
   3. LOAD CUSTOMERS FROM DATABASE
   ========================================================= */

async function loadCustomers() {

    try {

        const response = await fetch(
            "https://stonehub-backend-service.onrender.com/api/admin/customers"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load customers"
            );

        }


        customers = await response.json();


        renderCustomers();

    } catch (error) {

        console.error(
            "Customers loading error:",
            error
        );

    }

}


/* =========================================================
   4. RENDER CUSTOMERS
   ========================================================= */

function renderCustomers(customerList = customers) {

    customersTableBody.innerHTML = "";


    /*
     * If there are no customers.
     */

    if (customerList.length === 0) {

        customersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >
                    No customers found.
                </td>

            </tr>

        `;

        return;

    }


    /*
     * Create a row for every customer.
     */

    customerList.forEach(function (customer) {

        const row =
            document.createElement("tr");


        /*
         * Build the customer's full name.
         */

        const name =
            `${customer.first_name} ${customer.last_name}`;


        /*
         * Get the first letter of the customer's first name.
         */

        const initial =
            customer.first_name.charAt(0).toUpperCase();


        /*
         * Format the date the customer joined.
         */

        const joined =
            new Date(
                customer.date_created
            ).toLocaleDateString();


        /*
         * We don't currently have these values
         * in the customers table.
         *
         * So we temporarily display safe defaults.
         */

        const orders = 0;

        const totalSpent = 0;

        const status = "Active";


        const statusClass =
            status === "Active"
                ? "completed"
                : "cancelled";


        row.innerHTML = `

            <td>

                <div class="customer-cell">

                    <div class="customer-table-avatar">
                        ${initial}
                    </div>


                    <div class="customer-table-info">

                        <strong>
                            ${name}
                        </strong>

                        <span>
                            Joined ${joined}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${customer.email}
            </td>


            <td>
                ${customer.phone_number}
            </td>


            <td>
                ${orders}
            </td>


            <td>
                GHâ‚µ ${totalSpent.toFixed(2)}
            </td>


            <td>

                <span class="status ${statusClass}">
                    ${status}
                </span>

            </td>


            <td>

                <div class="customer-actions">

                    <button
                        class="customer-view-button"
                        onclick="viewCustomer(${customer.customer_id})"
                    >
                        View
                    </button>


                    <button
                        class="customer-edit-button"
                        onclick="editCustomer(${customer.customer_id})"
                    >
                        Edit
                    </button>


                    <button
                        class="customer-delete-button"
                        onclick="deleteCustomer(${customer.customer_id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        customersTableBody.appendChild(row);

    });

}


/* =========================================================
   5. SEARCH + FILTER
   ========================================================= */

function applyCustomerFilters() {

    const searchTerm =
        customerSearch.value
            .toLowerCase()
            .trim();


    const filteredCustomers =
        customers.filter(function (customer) {


            const name =
                `${customer.first_name} ${customer.last_name}`
                    .toLowerCase();


            const email =
                customer.email.toLowerCase();


            const phone =
                customer.phone_number.toLowerCase();


            const matchesSearch =

                name.includes(searchTerm)

                ||

                email.includes(searchTerm)

                ||

                phone.includes(searchTerm);


            /*
             * Status is not currently stored
             * in the customers database table.
             *
             * For now, every customer is treated
             * as Active.
             */

            const status = "Active";


            const matchesStatus =

                currentCustomerStatus === "All"

                ||

                status === currentCustomerStatus;


            return matchesSearch && matchesStatus;

        });


    renderCustomers(filteredCustomers);

}


/* =========================================================
   6. SEARCH EVENT
   ========================================================= */

customerSearch.addEventListener(
    "input",
    applyCustomerFilters
);


/* =========================================================
   7. FILTER BUTTONS
   ========================================================= */

customerFilters.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {


            customerFilters.forEach(
                function (filterButton) {

                    filterButton.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add("active");


            currentCustomerStatus =
                button.dataset.status;


            applyCustomerFilters();

        }
    );

});


/* =========================================================
   8. VIEW CUSTOMER
   ========================================================= */

function viewCustomer(id) {

    const customer =
        customers.find(function (customer) {

            return customer.customer_id === id;

        });


    if (!customer) {
        return;
    }


    const name =
        `${customer.first_name} ${customer.last_name}`;


    const initial =
        customer.first_name.charAt(0).toUpperCase();


    const joined =
        new Date(
            customer.date_created
        ).toLocaleDateString();


    customerDetails.innerHTML = `

        <div class="customer-profile-header">

            <div class="customer-large-avatar">
                ${initial}
            </div>


            <div class="customer-profile-info">

                <h4>
                    ${name}
                </h4>

                <span>
                    ${customer.email}
                </span>

            </div>

        </div>


        <div class="customer-stats">

            <div class="customer-stat">

                <span>
                    Customer ID
                </span>

                <strong>
                    ${customer.customer_id}
                </strong>

            </div>


            <div class="customer-stat">

                <span>
                    Phone
                </span>

                <strong>
                    ${customer.phone_number}
                </strong>

            </div>


            <div class="customer-stat">

                <span>
                    Joined
                </span>

                <strong>
                    ${joined}
                </strong>

            </div>

        </div>


        <div class="customer-history">

            <h4>
                Customer Information
            </h4>


            <div class="customer-order">

                <div class="customer-order-info">

                    <strong>
                        Address
                    </strong>

                    <span>
                        ${customer.address || "No address provided"}
                    </span>

                </div>

            </div>

        </div>

    `;


    customerModal.classList.add("show");

}


/* =========================================================
   9. EDIT CUSTOMER
   ========================================================= */

function editCustomer(id) {

    const customer =
        customers.find(function (customer) {

            return customer.customer_id === id;

        });


    if (!customer) {
        return;
    }


    editingCustomerId = id;


    /*
     * The current HTML has one field for
     * Full Name, so combine first + last name.
     */

    document.querySelector("#customerName").value =
        `${customer.first_name} ${customer.last_name}`;


    document.querySelector("#customerEmail").value =
        customer.email;


    document.querySelector("#customerPhone").value =
        customer.phone_number;


    /*
     * Status is not currently stored in the database.
     */

    document.querySelector("#customerStatus").value =
        "Active";


    editCustomerModal.classList.add("show");

}


/* =========================================================
   10. SAVE CUSTOMER
   ========================================================= */

customerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (editingCustomerId === null) {
            return;
        }


        const fullName =
            document.querySelector("#customerName").value.trim();


        const email =
            document.querySelector("#customerEmail").value.trim();


        const phone =
            document.querySelector("#customerPhone").value.trim();


        /*
         * Split the full name into first name
         * and last name.
         */

        const nameParts =
            fullName.split(" ");


        const firstName =
            nameParts.shift();


        const lastName =
            nameParts.join(" ");


        try {

            const response = await fetch(
                `https://stonehub-backend-service.onrender.com/api/admin/customers/${editingCustomerId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        first_name: firstName,

                        last_name: lastName,

                        email: email,

                        phone_number: phone

                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update customer"
                );

            }


            console.log(
                "Customer updated successfully"
            );


            await loadCustomers();


            editCustomerModal.classList.remove(
                "show"
            );


        } catch (error) {

            console.error(
                "Update customer error:",
                error
            );


            alert(
                "Failed to update customer."
            );

        }

    }
);


/* =========================================================
   11. DELETE CUSTOMER
   ========================================================= */

async function deleteCustomer(id) {

    const customer =
        customers.find(function (customer) {

            return customer.customer_id === id;

        });


    if (!customer) {
        return;
    }


    const name =
        `${customer.first_name} ${customer.last_name}`;


    const confirmed =
        confirm(
            `Delete "${name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `https://stonehub-backend-service.onrender.com/api/admin/customers/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to delete customer"
            );

        }


        console.log(
            "Customer deleted successfully"
        );


        await loadCustomers();


    } catch (error) {

        console.error(
            "Delete customer error:",
            error
        );


        alert(
            "Failed to delete customer."
        );

    }

}


/* =========================================================
   12. CLOSE DETAILS MODAL
   ========================================================= */

closeCustomerModal.addEventListener(
    "click",
    function () {

        customerModal.classList.remove("show");

    }
);


/* =========================================================
   13. CLOSE EDIT MODAL
   ========================================================= */

closeEditCustomerModal.addEventListener(
    "click",
    function () {

        editCustomerModal.classList.remove("show");

    }
);


cancelCustomerEdit.addEventListener(
    "click",
    function () {

        editCustomerModal.classList.remove("show");

    }
);


/* =========================================================
   14. CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

customerModal.addEventListener(
    "click",
    function (event) {

        if (event.target === customerModal) {

            customerModal.classList.remove("show");

        }

    }
);


editCustomerModal.addEventListener(
    "click",
    function (event) {

        if (event.target === editCustomerModal) {

            editCustomerModal.classList.remove("show");

        }

    }
);


/* =========================================================
   15. INITIAL LOAD
   ========================================================= */

loadCustomers();
