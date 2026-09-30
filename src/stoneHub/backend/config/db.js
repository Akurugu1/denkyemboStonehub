const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    ssl: {
        ca: fs.readFileSync(__dirname + "/../ca.pem"),
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database");
    }
});

module.exports = db;