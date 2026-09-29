/* =========================================================
   STONEHUB PRODUCTS
   ========================================================= */


/* =========================================================
   1. PRODUCT DATA
   ========================================================= */

let products = [];

const categories = {
    1: "Granite",
    2: "Marble",
    3: "Quartz"
};


/* =========================================================
   2. LOAD PRODUCTS
   ========================================================= */

async function loadProducts() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/products"
        );

        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                `Server returned ${response.status}: ${errorText}`
            );

        }

        products = await response.json();

        renderProducts();

    } catch (error) {

        console.error(
            "Products loading error:",
            error
        );

    }

}


/* =========================================================
   3. GET HTML ELEMENTS
   ========================================================= */

const productsTableBody =
    document.querySelector("#productsTableBody");

const addProductButton =
    document.querySelector("#addProductButton");

const productModal =
    document.querySelector("#productModal");

const closeModal =
    document.querySelector("#closeModal");

const cancelProduct =
    document.querySelector("#cancelProduct");

const productForm =
    document.querySelector("#productForm");

const modalTitle =
    document.querySelector("#modalTitle");

const productSearch =
    document.querySelector("#productSearch");


/*
 * null = adding a new product
 * number = editing an existing product
 */

let editingProductId = null;


/* =========================================================
   4. DISPLAY PRODUCTS
   ========================================================= */

function renderProducts(productList = products) {

    productsTableBody.innerHTML = "";


    if (productList.length === 0) {

        productsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center; padding:30px;"
                >
                    No products found.
                </td>
            </tr>
        `;

        return;

    }


    productList.forEach(function (product) {

        const row =
            document.createElement("tr");


        const stockQuantity =
            Number(product.stock_quantity || 0);


        const stockClass =
            stockQuantity <= 10
                ? "stock-low"
                : "stock-good";


        const statusClass =
            stockQuantity > 0
                ? "completed"
                : "cancelled";


        const statusText =
            stockQuantity > 0
                ? "In Stock"
                : "Out of Stock";


        row.innerHTML = `

            <td>
                <span class="product-name">
                    ${product.product_name || "Unnamed Product"}
                </span>
            </td>


            <td>
                <span class="product-category">
                    ${
                        categories[product.category_id]
                        || "Unknown"
                    }
                </span>
            </td>


            <td>
                GHâ‚µ ${Number(product.price || 0).toFixed(2)}
            </td>


            <td>
                <span class="${stockClass}">
                    ${stockQuantity}
                </span>
            </td>


            <td>
                <span class="status ${statusClass}">
                    ${statusText}
                </span>
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-button"
                        onclick="editProduct(${product.product_id})"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-button"
                        onclick="deleteProduct(${product.product_id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        productsTableBody.appendChild(row);

    });

}


/* =========================================================
   5. OPEN ADD PRODUCT MODAL
   ========================================================= */

function openAddProductModal() {

    editingProductId = null;


    modalTitle.textContent =
        "Add Product";


    productForm.reset();


    /*
     * Make sure the image input is also cleared.
     */

    const imageInput =
        document.querySelector("#productImage");

    if (imageInput) {

        imageInput.value = "";

    }


    productModal.classList.add("show");

}


/* =========================================================
   6. CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

    productModal.classList.remove("show");

}


/* =========================================================
   7. EDIT PRODUCT
   ========================================================= */

function editProduct(id) {

    const product =
        products.find(function (item) {

            return Number(item.product_id) === Number(id);

        });


    if (!product) {

        console.error(
            "Product not found:",
            id
        );

        return;

    }


    editingProductId =
        Number(id);


    modalTitle.textContent =
        "Edit Product";


    document.querySelector("#productName").value =
        product.product_name || "";


    document.querySelector("#productDescription").value =
        product.description || "";


    /*
     * IMPORTANT:
     *
     * We cannot automatically put the existing
     * local image into a file input.
     */

    document.querySelector("#productImage").value =
        "";


    document.querySelector("#productDimensions").value =
        product.dimensions || "";


    document.querySelector("#productMaterial").value =
        product.material || "";


    document.querySelector("#productCategory").value =
        product.category_id || "";


    document.querySelector("#productPrice").value =
        product.price || "";


    document.querySelector("#productStock").value =
        product.stock_quantity || "";


    document.querySelector("#productSupplier").value =
        product.supplier_id || "";


    productModal.classList.add("show");

}


/* =========================================================
   8. SAVE PRODUCT
   ========================================================= */

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* -------------------------------------------------
           GET FORM VALUES
           ------------------------------------------------- */

        const name =
            document
                .querySelector("#productName")
                .value
                .trim();


        const categoryId =
            Number(
                document
                    .querySelector("#productCategory")
                    .value
            );


        const price =
            Number(
                document
                    .querySelector("#productPrice")
                    .value
            );


        const stock =
            Number(
                document
                    .querySelector("#productStock")
                    .value
            );


        const description =
            document
                .querySelector("#productDescription")
                .value
                .trim();


        const dimensions =
            document
                .querySelector("#productDimensions")
                .value
                .trim();


        const material =
            document
                .querySelector("#productMaterial")
                .value
                .trim();


        const supplierId =
            Number(
                document
                    .querySelector("#productSupplier")
                    .value
            );


        /* -------------------------------------------------
           GET IMAGE
           ------------------------------------------------- */

        const imageInput =
            document.querySelector("#productImage");


        const imageFile =
            imageInput &&
            imageInput.files.length > 0
                ? imageInput.files[0]
                : null;


        /* -------------------------------------------------
           BASIC VALIDATION
           ------------------------------------------------- */

        if (!name) {

            alert("Please enter a product name.");

            return;

        }


        if (!categoryId) {

            alert("Please select a category.");

            return;

        }


        if (isNaN(price) || price < 0) {

            alert("Please enter a valid price.");

            return;

        }


        if (isNaN(stock) || stock < 0) {

            alert("Please enter a valid stock quantity.");

            return;

        }


        if (!supplierId) {

            alert("Please select a supplier.");

            return;

        }


        /* -------------------------------------------------
           CREATE FORMDATA
           ------------------------------------------------- */

        const formData =
            new FormData();


        formData.append(
            "product_name",
            name
        );


        formData.append(
            "description",
            description
        );


        formData.append(
            "price",
            price
        );


        formData.append(
            "stock_quantity",
            stock
        );


        formData.append(
            "dimensions",
            dimensions
        );


        formData.append(
            "material",
            material
        );


        formData.append(
            "category_id",
            categoryId
        );


        formData.append(
            "supplier_id",
            supplierId
        );


        /*
         * Only attach an image when
         * the admin selected one.
         */

        if (imageFile) {

            formData.append(
                "productImage",
                imageFile
            );

        }


        /* =================================================
           EDIT EXISTING PRODUCT
           ================================================= */

        if (editingProductId !== null) {

            try {

                console.log(
                    "Updating product:",
                    editingProductId
                );


                const response =
                    await fetch(
                        `http://localhost:5000/api/admin/products/${editingProductId}`,
                        {
                            method: "PUT",
                            body: formData
                        }
                    );


                /*
                 * Read the server response as text first.
                 * This prevents JSON parsing errors when
                 * the server returns HTML or plain text.
                 */

                const responseText =
                    await response.text();


                console.log(
                    "UPDATE STATUS:",
                    response.status
                );


                console.log(
                    "UPDATE RESPONSE:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        `Server returned ${response.status}: ${responseText}`
                    );

                }


                console.log(
                    "Product updated successfully."
                );


                await loadProducts();


                closeProductModal();


            } catch (error) {

                console.error(
                    "Update product error:",
                    error
                );


                alert(
                    `Failed to update product.\n\n${error.message}`
                );

            }


            return;

        }


        /* =================================================
           ADD NEW PRODUCT
           ================================================= */

        try {

            console.log(
                "Creating product..."
            );


            const response =
                await fetch(
                    "http://localhost:5000/api/admin/products",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            /*
             * Read response as text first.
             */

            const responseText =
                await response.text();


            console.log(
                "CREATE STATUS:",
                response.status
            );


            console.log(
                "CREATE RESPONSE:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}: ${responseText}`
                );

            }


            /*
             * Try to convert the response to JSON.
             * If the server does not return JSON,
             * we still consider the request successful.
             */

            let data = null;


            try {

                data =
                    JSON.parse(responseText);

            } catch (jsonError) {

                console.log(
                    "Server response was not JSON."
                );

            }


            console.log(
                "Product created successfully:",
                data
            );


            await loadProducts();


            closeProductModal();


        } catch (error) {

            console.error(
                "Create product error:",
                error
            );


            alert(
                `Failed to create product.\n\n${error.message}`
            );

        }

    }
);


/* =========================================================
   9. DELETE PRODUCT
   ========================================================= */

async function deleteProduct(id) {

    const product =
        products.find(function (item) {

            return Number(item.product_id) === Number(id);

        });


    if (!product) {

        console.error(
            "Product not found:",
            id
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${product.product_name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/admin/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        console.log(
            "DELETE STATUS:",
            response.status
        );


        console.log(
            "DELETE RESPONSE:",
            responseText
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}: ${responseText}`
            );

        }


        console.log(
            "Product deleted successfully."
        );


        await loadProducts();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        alert(
            `Failed to delete product.\n\n${error.message}`
        );

    }

}


/* =========================================================
   10. SEARCH PRODUCTS
   ========================================================= */

productSearch.addEventListener(
    "input",
    function () {

        const searchTerm =
            productSearch.value
                .toLowerCase()
                .trim();


        const filteredProducts =
            products.filter(function (product) {

                const productName =
                    (
                        product.product_name || ""
                    )
                        .toLowerCase();


                const categoryName =
                    (
                        categories[product.category_id]
                        || ""
                    )
                        .toLowerCase();


                return (
                    productName.includes(searchTerm)
                    ||
                    categoryName.includes(searchTerm)
                );

            });


        renderProducts(
            filteredProducts
        );

    }
);


/* =========================================================
   11. BUTTON EVENTS
   ========================================================= */

addProductButton.addEventListener(
    "click",
    openAddProductModal
);


closeModal.addEventListener(
    "click",
    closeProductModal
);


cancelProduct.addEventListener(
    "click",
    closeProductModal
);


/* =========================================================
   12. CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

productModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === productModal
        ) {

            closeProductModal();

        }

    }
);


/* =========================================================
   13. INITIAL LOAD
   ========================================================= */

loadProducts();