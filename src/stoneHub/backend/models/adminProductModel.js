const db = require("../config/db");


/* =========================================================
   CREATE PRODUCT
   ========================================================= */

const createProduct = (product, callback) => {

    if (!product) {

        return callback(
            new Error("Product data is missing"),
            null
        );

    }


    const sql = `
        INSERT INTO product
        (
            product_name,
            description,
            price,
            stock_quantity,
            image_url,
            dimensions,
            material,
            category_id,
            supplier_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [

        product.product_name,

        product.description,

        product.price,

        product.stock_quantity,

        product.image_url,

        product.dimensions,

        product.material,

        product.category_id,

        product.supplier_id

    ];


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, result);

        }
    );

};


/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

const getAllProducts = (callback) => {

    const sql = `
        SELECT *
        FROM product
        ORDER BY product_id DESC
    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, results);

        }
    );

};


/* =========================================================
   UPDATE PRODUCT
   ========================================================= */
    const updateProduct = (id, product, callback) => {

    let sql = `
        UPDATE product
        SET
            product_name = ?,
            description = ?,
            price = ?,
            stock_quantity = ?,
            dimensions = ?,
            material = ?,
            category_id = ?,
            supplier_id = ?
    `;


    const values = [

        product.product_name,

        product.description,

        product.price,

        product.stock_quantity,

        product.dimensions,

        product.material,

        product.category_id,

        product.supplier_id

    ];


    /*
     * Only update image_url when
     * a new image was uploaded.
     */

    if (product.image_url) {

        sql += `,
            image_url = ?
        `;

        values.push(
            product.image_url
        );

    }


    sql += `
        WHERE product_id = ?
    `;

    values.push(id);


    db.query(

        sql,

        values,

        (err, result) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, result);

        }

    );

};
    

/* =========================================================
   DELETE PRODUCT
   ========================================================= */

const deleteProduct = (id, callback) => {

    const sql = `
        DELETE FROM product
        WHERE product_id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                return callback(err, null);

            }


            callback(null, result);

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
