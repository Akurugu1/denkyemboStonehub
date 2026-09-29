const express = require("express");

const router = express.Router();

const adminProductController =
    require("../controllers/adminProductController");

const upload =
    require("../middleware/uploadMiddleware");


/* =========================================================
   CREATE PRODUCT
   ========================================================= */

router.post(

    "/",

    upload.single("productImage"),

    adminProductController.createProduct

);


/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

router.get(

    "/",

    adminProductController.getAllProducts

);


/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

router.put(

    "/:id",
    upload.single("productImage"),
    
    adminProductController.updateProduct

);


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

router.delete(

    "/:id",

    adminProductController.deleteProduct

);


module.exports = router;
