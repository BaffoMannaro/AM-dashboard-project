require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'config', 'ca.pem')),
        minVersion: 'TLSv1.2'
    }
};

async function testConnection() {
    console.log('--- Testing with createConnection ---');
    let connection;
    try {
        connection = await mysql.createConnection(connectionConfig);
        console.log('createConnection: Success! Connected to the database.');
        await connection.end();
        console.log('createConnection: Connection closed.');
    } catch (err) {
        console.error('createConnection: Failed to connect to the database.', err);
    }
}

async function testPool() {
    console.log('\n--- Testing with createPool ---');
    const pool = mysql.createPool({
        ...connectionConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    let connection;
    try {
        connection = await pool.getConnection();
        console.log('createPool: Success! Acquired a connection from the pool.');
        const [rows] = await connection.query('SELECT 1 + 1 AS solution');
        console.log('createPool: Test query successful. Result:', rows[0].solution);
        connection.release();
        console.log('createPool: Connection released back to the pool.');
    } catch (err) {
        console.error('createPool: Failed to get a connection from the pool or execute query.', err);
    } finally {
        await pool.end();
        console.log('createPool: Pool closed.');
    }
}

async function runTests() {
    await testConnection();
    await testPool();
}

runTests();