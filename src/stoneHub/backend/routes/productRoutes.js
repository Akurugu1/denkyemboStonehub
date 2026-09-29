const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");


router.get("/", productController.getProducts);

router.get("/category/:category_id", productController.getProductsByCategory);

router.get("/search", productController.searchProducts);

router.get("/:id", productController.getProductById);


module.exports = router;