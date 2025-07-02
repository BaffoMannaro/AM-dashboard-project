const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

if (process.env.DB_SSL_REQUIRED === 'true') {
    connectionConfig.ssl = {
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
        minVersion: 'TLSv1.2' // Forza TLS 1.2
    };
}

// Riconfigurato per usare un pool, che è la best practice per Express
// Il problema non era createPool vs createConnection, ma probabilmente la gestione delle connessioni nei controller
const pool = mysql.createPool(connectionConfig);

// Esportiamo direttamente il pool, che gestirà le connessioni in modo efficiente
module.exports = pool;
