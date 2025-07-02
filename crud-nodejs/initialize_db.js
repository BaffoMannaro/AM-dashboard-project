const mysql = require('mysql2/promise'); // Usa la versione promise
const fs = require('fs').promises; // Usa la versione promise di fs
const fsSync = require('fs'); // Aggiungiamo fs sincrono per leggere il certificato
const path = require('path');
require('dotenv').config();

const dropAndRecreateDatabase = async () => {
    let connection;
    try {
        const connectionConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            multipleStatements: true
        };

        if (process.env.DB_SSL_REQUIRED === 'true') {
            connectionConfig.ssl = {
                ca: fsSync.readFileSync(path.join(__dirname, 'config', 'ca.pem')),
                minVersion: 'TLSv1.2' // Forza TLS 1.2
            };
        }

        connection = await mysql.createConnection(connectionConfig);

        console.log('Connesso al database per la reinizializzazione.');

        const initSql = await fs.readFile(path.join(__dirname, 'database', 'init_db.sql'), 'utf8');

        // Estrai i nomi delle tabelle dallo script SQL
        const tableNames = [...initSql.matchAll(/CREATE TABLE IF NOT EXISTS `?(\w+)`?/gi)].map(m => m[1]);

        // Disabilita i controlli sulle chiavi esterne
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('Disabilitati i controlli sulle chiavi esterne.');

        // Esegui il drop delle tabelle in ordine inverso per sicurezza
        for (const tableName of tableNames.reverse()) {
            console.log(`Cancellazione della tabella ${tableName}...`);
            await connection.query(`DROP TABLE IF EXISTS ${tableName}`);
        }

        // Riabilita i controlli sulle chiavi esterne
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Riabilitati i controlli sulle chiavi esterne.');

        // Esegui lo script di inizializzazione per ricreare le tabelle
        console.log('Esecuzione dello script di inizializzazione...');
        await connection.query(initSql);

        console.log('Database ricreato con successo!');

    } catch (err) {
        console.error('Errore durante la reinizializzazione del database:', err);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connessione al database chiusa.');
        }
    }
};

dropAndRecreateDatabase();