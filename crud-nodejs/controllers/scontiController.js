// TABELLA sconti
// Implementa la logica di business per le operazioni CRUD

const ScontiModel = require('../models/dbModels');

// Usa async/await per gestire le operazioni asincrone
exports.getAllSconti = async (req, res) => {
    try {
        // Chiama la funzione del modello che restituisce una Promise
        const data = await ScontiModel.getAllSconti();
        res.json(data);
    } catch (error) {
        // Gestisce gli errori
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero degli sconti' });
    }
};

exports.getScontoById = async (req, res) => {
    try {
        // L'ID viene dai parametri dell'URL, non dal body
        const data = await ScontiModel.getScontoById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Sconto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dello sconto' });
    }
};

exports.createSconto = async (req, res) => {
    try {
        const result = await ScontiModel.createSconto(req.body);
        res.status(201).json({ message: 'Sconto creato con successo', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione dello sconto' });
    }
};

exports.updateSconto = async (req, res) => {
    try {
        const result = await ScontiModel.updateSconto(req.params.id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: 'Sconto aggiornato con successo' });
        } else {
            res.status(404).json({ message: 'Sconto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante aggiornamento dello sconto' });
    }
};

exports.deleteSconto = async (req, res) => {
    try {
        const result = await ScontiModel.deleteSconto(req.params.id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Sconto cancellato con successo' });
        } else {
            res.status(404).json({ message: 'Sconto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la cancellazione dello sconto' });
    }
};
