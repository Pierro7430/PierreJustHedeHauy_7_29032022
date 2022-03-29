// import de mysql
const mysql = require('mysql2');

// import du package dotenv pour utiliser les variables environnements
const dotenv = require('dotenv').config();

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

mysqlConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected database MySql !');
});

module.exports = mysqlConnection;