const Product = require("../models/productModel");


const getProducts = (req, res) => {
    Product.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(200).json(products);
    });
};


const getProductById = (req, res) => {
    const productId = req.params.id;

    Product.getProductById(productId, (err, product) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }


        if (product.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        res.status(200).json(product[0]);
    });
};

const getProductsByCategory = (req, res) => {
    const categoryId = req.params.category_id;

    Product.getProductsByCategory(categoryId, (err, products) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(200).json(products);
    });
};

const searchProducts = (req, res) => {
    const keyword = req.query.keyword;

    Product.searchProducts(keyword, (err, products) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found",
                suggestions: "Try another keyword"
            });
        }

        res.status(200).json(products);
    });
};

module.exports = {
    getProducts,
    getProductById,
    getProductsByCategory,
    searchProducts
};
