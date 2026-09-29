const mysql = require("mysql2");
//Open my .env files and load the values
require("dotenv").config();

//Now access those vairables using process.env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

//Now actually connect to the database
db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database");
    }
});
//export module to be used elsewhere
module.exports = db;
