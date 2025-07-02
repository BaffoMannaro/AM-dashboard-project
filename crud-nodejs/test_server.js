const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`Richiesta ricevuta: ${req.url}`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server di base funzionante');
});

server.listen(port, hostname, () => {
  console.log(`Server in esecuzione su http://${hostname}:${port}/`);
});