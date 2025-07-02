// Gestisce gli errori dell'applicazione in modo centralizzato

module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};