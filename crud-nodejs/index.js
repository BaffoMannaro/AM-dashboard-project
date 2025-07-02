require('dotenv').config(); // DEVE ESSERE LA PRIMA RIGA

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./routes/Routes');
const http = require('http');
const pool = require('./config/database'); // Importa il pool di connessioni


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Gestione esplicita delle richieste OPTIONS per il preflight CORS
app.options('*', cors()); // Abilita pre-flight per tutte le rotte

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Richiesta ricevuta in index.js: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', Routes);

const server = http.createServer(app);

// Funzione per avviare il server dopo aver verificato la connessione al DB
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful.');
    connection.release();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database. Server not started.', err);
    process.exit(1); // Esce dall'applicazione se la connessione al DB fallisce
  }
}

startServer();