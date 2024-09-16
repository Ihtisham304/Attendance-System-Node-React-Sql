const mysql = require("mysql2");
require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,  // Uses DB_PASS from .en
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Mysql Connected SuccessFully");
})



module.exports = db;