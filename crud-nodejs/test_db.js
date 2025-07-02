require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  let pool;
  let connection;
  try {
    console.log('Tentativo di creare il pool di connessioni...');
    const poolOptions = {
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
      poolOptions.ssl = { rejectUnauthorized: false };
    }

    pool = mysql.createPool(poolOptions);
    console.log('Pool di connessioni creato.');

    console.log('Tentativo di ottenere una connessione dal pool...');
    connection = await pool.getConnection();
    console.log('Connessione ottenuta dal pool!');

    console.log('Esecuzione di una query di test...');
    const [rows] = await connection.execute('SELECT * FROM preventivi_materiali WHERE preventivo_mat_id = 6');
    console.log('Materiali per preventivo 6:', rows);
    
    const [allRows] = await connection.execute('SELECT * FROM preventivi_materiali');
    console.log('Tutti i preventivi_materiali:', allRows);

  } catch (error) {
    console.error('Errore durante il test del pool di connessioni:', error);
  } finally {
    if (connection) {
      console.log('Rilascio della connessione.');
      connection.release();
    }
    if (pool) {
      console.log('Chiusura del pool di connessioni.');
      await pool.end();
    }
  }
}

testConnection();