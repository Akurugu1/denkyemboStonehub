//import db.js file from config folder
const db = require("../config/db");

//function fetches all products from the db
const getAllProducts = (callback) => {

    const sql = `
        SELECT
            product_id,
            product_name,
            description,
            price,
            stock_quantity,
            image_url,
            dimensions,
            material,
            category_id,
            supplier_id
        FROM product
        WHERE stock_quantity > 0
    `;

    db.query(sql, (err, results) => {

        callback(err, results);

    });

};

//function gets product by id
const getProductById = (id, callback) => {
    const sql = "SELECT * FROM product WHERE product_id = ?";
    //runs the qury and replaces ? with [id] 
    //array output expected
    db.query(sql, [id], (err, result) => {
        callback(err, result);
    });
};

//function gets products by category
const getProductsByCategory = (category_id, callback) => {
    const sql = "SELECT * FROM product WHERE category_id = ?";

    db.query(sql, [category_id], (err, results) => {
        callback(err, results);
    });
};

//function searches products by keyword
const searchProducts = (keyword, callback) => {
    const sql = `
        SELECT * FROM product
        WHERE product_name LIKE ?
        OR description LIKE ?
        OR material LIKE ?
    `;

    const searchTerm = `%${keyword}%`;

    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        callback(err, results);
    });
};

//export modules to be used elsewhere
module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts
};
