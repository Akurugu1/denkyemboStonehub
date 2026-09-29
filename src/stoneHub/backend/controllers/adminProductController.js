const AdminProduct = require("../models/adminProductModel");


/* =========================================================
   CREATE PRODUCT
   ========================================================= */

const createProduct = (req, res) => {

    console.log("CREATE PRODUCT REQUEST");

    console.log("BODY:", req.body);

    console.log("FILE:", req.file);


    const product = req.body || {};


    /* ---------------------------------------------------------
       Validate required fields
       --------------------------------------------------------- */

    if (!product.product_name) {

        return res.status(400).json({

            message: "Product name is required"

        });

    }


    if (!product.category_id) {

        return res.status(400).json({

            message: "Category is required"

        });

    }


    if (!product.price) {

        return res.status(400).json({

            message: "Price is required"

        });

    }


    if (!product.stock_quantity) {

        return res.status(400).json({

            message: "Stock quantity is required"

        });

    }


    /* ---------------------------------------------------------
       Image
       --------------------------------------------------------- */

    if (req.file) {

        product.image_url =
            `/uploads/products/${req.file.filename}`;

    } else {

        product.image_url = null;

    }


    console.log("PRODUCT BEING SENT TO MODEL:");

    console.log(product);


    /* ---------------------------------------------------------
       Save product
       --------------------------------------------------------- */

    AdminProduct.createProduct(

        product,

        (err, result) => {

            if (err) {

                console.error(
                    "CREATE PRODUCT DATABASE ERROR:",
                    err
                );


                return res.status(500).json({

                    message: "Database error",

                    error: err.message

                });

            }


            console.log(
                "PRODUCT CREATED:",
                result
            );


            res.status(201).json({

                message:
                    "Product created successfully",

                product_id:
                    result.insertId,

                image_url:
                    product.image_url

            });

        }

    );

};


/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

const getAllProducts = (req, res) => {

    AdminProduct.getAllProducts(

        (err, products) => {

            if (err) {

                console.error(
                    "GET PRODUCTS ERROR:",
                    err
                );


                return res.status(500).json({

                    message: "Database error",

                    error: err.message

                });

            }


            res.status(200).json(products);

        }

    );

};


/* =========================================================
   UPDATE PRODUCT
   ========================================================= */
    const updateProduct = (req, res) => {

    const productId = req.params.id;

    const product = req.body || {};

    console.log(
        "UPDATING PRODUCT:",
        productId
    );

    console.log(
        "UPDATE BODY:",
        product
    );

    console.log(
        "UPDATE FILE:",
        req.file
    );


    /*
     * If a new image was uploaded,
     * use the new image.
     *
     * If no image was uploaded,
     * image_url will not be changed.
     */

    if (req.file) {

        product.image_url =
            `/uploads/products/${req.file.filename}`;

    }


    AdminProduct.updateProduct(

        productId,

        product,

        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE PRODUCT ERROR:",
                    err
                );

                return res.status(500).json({

                    message: "Database error",

                    error: err.message

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    message: "Product not found"

                });

            }


            res.status(200).json({

                message:
                    "Product updated successfully"

            });

        }

    );

};



/* =========================================================
   DELETE PRODUCT
   ========================================================= */

const deleteProduct = (req, res) => {

    const productId = req.params.id;


    AdminProduct.deleteProduct(

        productId,

        (err, result) => {

            if (err) {

                console.error(
                    "DELETE PRODUCT ERROR:",
                    err
                );


                return res.status(500).json({

                    message: "Database error",

                    error: err.message

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    message: "Product not found"

                });

            }


            res.status(200).json({

                message:
                    "Product deleted successfully"

            });

        }

    );

};


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {

    createProduct,

    getAllProducts,

    updateProduct,

    deleteProduct

};
