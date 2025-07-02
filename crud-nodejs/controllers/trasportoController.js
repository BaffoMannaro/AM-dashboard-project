// TABELLA trasporto
// Implementa la logica di business per le operazioni CRUD

const TrasportoModel = require('../models/dbModels');

exports.getAllTrasporto = async (req, res) => {
    try {
        const data = await TrasportoModel.getAllTrasporto();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei trasporti' });
    }
};

exports.getTrasportoById = async (req, res) => {
    try {
        const data = await TrasportoModel.getTrasportoById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Trasporto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero del trasporto' });
    }
};

exports.createTrasporto = async (req, res) => {
    try {
        const result = await TrasportoModel.createTrasporto(req.body);
        res.status(201).json({ message: 'Trasporto creato con successo', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione del trasporto' });
    }
};

exports.updateTrasporto = async (req, res) => {
    try {
        const result = await TrasportoModel.updateTrasporto(req.params.id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: 'Trasporto aggiornato con successo' });
        } else {
            res.status(404).json({ message: 'Trasporto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del trasporto' });
    }
};

exports.deleteTrasporto = async (req, res) => {
    try {
        const result = await TrasportoModel.deleteTrasporto(req.params.id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Trasporto cancellato con successo' });
        } else {
            res.status(404).json({ message: 'Trasporto non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la cancellazione del trasporto' });
    }
};
