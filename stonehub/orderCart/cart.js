/* ==========================================================
   DENKYEMBO MARBLE & GRANITE - CORE SCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // Mock Product Catalogue Data
    const products = [
        { id: 1, name: "Grey Quartzite Slab", category: "Quartz", finish: "Polished", color: "Grey", thickness: "20mm", price: 2500, image: "images/marble.jpg", description: "Durable natural stone variant ideal for modern kitchens." },
        { id: 2, name: "Bianco Carrara Marble", category: "Marble", finish: "Polished", color: "White", thickness: "20mm", price: 3200, image: "images/marble.jpg", description: "Timeless classic Italian white marble." },
        { id: 3, name: "Absolute Black Granite", category: "Granite", finish: "Leathered", color: "Black", thickness: "30mm", price: 2800, image: "images/granite.jpg", description: "Deep black finish with high scratch resistance." },
        { id: 4, name: "Sahara Beige Quartz", category: "Quartz", finish: "Honed", color: "Beige", thickness: "20mm", price: 2100, image: "images/quartz.jpg", description: "Engineered stone surface with warm tones." },
        { id: 5, name: "Stellar Grey Granite", category: "Granite", finish: "Polished", color: "Grey", thickness: "30mm", price: 2400, image: "images/granite.jpg", description: "Resilient structural stone slab." },
        { id: 6, name: "Calacatta Gold Marble", category: "Marble", finish: "Honed", color: "White", thickness: "30mm", price: 4500, image: "images/marble.jpg", description: "Luxurious veining with a sophisticated finish." }
    ];

    // Local Storage Cart State
    let cart = JSON.parse(localStorage.getItem("denkyembo_cart")) || [
        { id: 1, name: "Grey Quartzite Slab", price: 2500, qty: 1, image: "images/marble.jpg" }
    ];

    // --- 1. SHOPPING CART LOGIC ---
    const cartToggle = document.getElementById("cartToggle");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    const cartBadge = document.getElementById("cartBadge");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartSubtotal = document.getElementById("cartSubtotal");

    function updateCartUI() {
        if (!cartBadge) return;
        
        let totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalCount;

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = "";
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<p style="text-align:center; color:var(--gray); padding:20px;">Your cart is empty.</p>`;
            } else {
                cart.forEach((item, index) => {
                    cartItemsContainer.innerHTML += `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>GHS ${item.price.toLocaleString()}</p>
                                <div class="cart-item-actions">
                                    <button onclick="changeQty(${index}, -1)">-</button>
                                    <span>${item.qty}</span>
                                    <button onclick="changeQty(${index}, 1)">+</button>
                                </div>
                            </div>
                            <button class="remove-item" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                });
            }
        }

        let subtotalVal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (cartSubtotal) {
            cartSubtotal.textContent = `GHS ${subtotalVal.toLocaleString()}`;
        }

        localStorage.setItem("denkyembo_cart", JSON.stringify(cart));
    }

    window.changeQty = function(index, delta) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart[index].qty = 1;
        updateCartUI();
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    window.addToCartById = function(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });
        }
        updateCartUI();
        if (cartDrawer) cartDrawer.classList.add("open");
        if (cartOverlay) cartOverlay.classList.add("active");
    };

    if (cartToggle) {
        cartToggle.addEventListener("click", (e) => {
            e.preventDefault();
            cartDrawer.classList.add("open");
            cartOverlay.classList.add("active");
        });
    }

    if (closeCart) closeCart.addEventListener("click", closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

    function closeCartDrawer() {
        if (cartDrawer) cartDrawer.classList.remove("open");
        if (cartOverlay) cartOverlay.classList.remove("active");
    }

    updateCartUI();


    // --- 2. SEARCH & FILTER LOGIC (Catalogue Page) ---
    const productGrid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterFinish = document.getElementById("filterFinish");
    const filterColor = document.getElementById("filterColor");
    const filterThickness = document.getElementById("filterThickness");
    const filterPrice = document.getElementById("filterPrice");
    const priceVal = document.getElementById("priceVal");
    const clearFiltersBtn = document.getElementById("clearFilters");
    const resultCount = document.getElementById("resultCount");

    function renderProducts(list) {
        if (!productGrid) return;
        productGrid.innerHTML = "";

        if (list.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h3>No products found</h3>
                    <p>Try modifying your search keywords or clearing active filters.</p>
                </div>
            `;
            if (resultCount) resultCount.textContent = "0 products found";
            return;
        }

        if (resultCount) resultCount.textContent = `Showing ${list.length} matching product(s)`;

        list.forEach(p => {
            productGrid.innerHTML += `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                        <div class="product-price">GHS ${p.price.toLocaleString()}</div>
                        <div class="product-actions">
                            <a href="product-detail.html" class="btn-sm btn-outline-sm">Configure</a>
                            <button class="btn-sm btn-primary-sm" onclick="addToCartById(${p.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    function applyFilters() {
        if (!productGrid) return;
        let query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        let finish = filterFinish ? filterFinish.value : "";
        let color = filterColor ? filterColor.value : "";
        let thickness = filterThickness ? filterThickness.value : "";
        let maxPrice = filterPrice ? Number(filterPrice.value) : 5000;

        if (priceVal) priceVal.textContent = maxPrice;

        let filtered = products.filter(p => {
            let matchQuery = query === "" || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
            let matchFinish = finish === "" || p.finish === finish;
            let matchColor = color === "" || p.color === color;
            let matchThickness = thickness === "" || p.thickness === thickness;
            let matchPrice = p.price <= maxPrice;

            return matchQuery && matchFinish && matchColor && matchThickness && matchPrice;
        });

        renderProducts(filtered);
    }

    if (productGrid) {
        renderProducts(products);
        if (searchInput) searchInput.addEventListener("input", applyFilters);
        if (searchBtn) searchBtn.addEventListener("click", applyFilters);
        if (filterFinish) filterFinish.addEventListener("change", applyFilters);
        if (filterColor) filterColor.addEventListener("change", applyFilters);
        if (filterThickness) filterThickness.addEventListener("change", applyFilters);
        if (filterPrice) filterPrice.addEventListener("input", applyFilters);

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                if (filterFinish) filterFinish.value = "";
                if (filterColor) filterColor.value = "";
                if (filterThickness) filterThickness.value = "";
                if (filterPrice) filterPrice.value = 5000;
                applyFilters();
            });
        }
    }


    // --- 3. QUANTITY CALCULATOR (Product Page) ---
    const calcLength = document.getElementById("calcLength");
    const calcWidth = document.getElementById("calcWidth");
    const calcUnit = document.getElementById("calcUnit");
    const calcBuffer = document.getElementById("calcBuffer");
    const calcArea = document.getElementById("calcArea");
    const calcTotal = document.getElementById("calcTotal");
    const unitPriceDisplay = document.getElementById("unitPriceDisplay");
    const addThisToCart = document.getElementById("addThisToCart");

    function calculateProject() {
        if (!calcLength || !calcWidth) return;

        let length = parseFloat(calcLength.value) || 0;
        let width = parseFloat(calcWidth.value) || 0;
        let unit = calcUnit ? calcUnit.value : "metres";
        let unitPrice = unitPriceDisplay ? parseFloat(unitPriceDisplay.getAttribute("data-price")) : 2500;

        let area = length * width;

        // Convert feet to square metres if unit is feet (1 sq ft = 0.092903 sq m)
        if (unit === "feet") {
            area = area * 0.092903;
        }

        // Add 10% buffer if enabled
        if (calcBuffer && calcBuffer.checked) {
            area = area * 1.10;
        }

        let totalCost = area * unitPrice;

        if (calcArea) calcArea.textContent = area.toFixed(2);
        if (calcTotal) calcTotal.textContent = `GHS ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (calcLength && calcWidth) {
        calcLength.addEventListener("input", calculateProject);
        calcWidth.addEventListener("input", calculateProject);
        if (calcUnit) calcUnit.addEventListener("change", calculateProject);
        if (calcBuffer) calcBuffer.addEventListener("change", calculateProject);

        if (addThisToCart) {
            addThisToCart.addEventListener("click", () => {
                let areaVal = parseFloat(calcArea.textContent) || 1;
                let totalCostVal = parseFloat(calcTotal.textContent.replace(/[^0-9.-]+/g,"")) || 2500;
                
                cart.push({
                    id: 99,
                    name: "Grey Quartzite (Custom Project)",
                    price: totalCostVal,
                    qty: 1,
                    image: "images/marble.jpg"
                });
                updateCartUI();
                if (cartDrawer) cartDrawer.classList.add("open");
                if (cartOverlay) cartOverlay.classList.add("active");
            });
        }
    }

});