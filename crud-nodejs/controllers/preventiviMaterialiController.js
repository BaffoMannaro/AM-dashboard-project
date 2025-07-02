// TABELLA preventivi_materiali
// Implementa la logica di business per le operazioni CRUD

const PreventiviMaterialiModel = require('../models/dbModels');

exports.getAllPreventiviMateriali = async (req, res) => {
    try {
        const data = await PreventiviMaterialiModel.getAllPreventiviMateriali();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei materiali dei preventivi' });
    }
};

exports.getPreventivoMaterialiById = async (req, res) => {
    try {
        const data = await PreventiviMaterialiModel.getPreventivoMaterialiById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Materiale del preventivo non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero del materiale del preventivo' });
    }
};

exports.createPreventivoMateriale = async (req, res) => {
    try {
        const result = await PreventiviMaterialiModel.createPreventivoMateriali(req.body);
        res.status(201).json({ message: 'Materiale del preventivo creato con successo', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione del materiale del preventivo' });
    }
};

exports.updatePreventivoMateriale = async (req, res) => {
    try {
        const result = await PreventiviMaterialiModel.updatePreventivoMateriali(req.params.id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: 'Materiale del preventivo aggiornato con successo' });
        } else {
            res.status(404).json({ message: 'Materiale del preventivo non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del materiale del preventivo' });
    }
};

exports.deletePreventivoMateriale = async (req, res) => {
    try {
        const result = await PreventiviMaterialiModel.deletePreventivoMateriali(req.params.id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Materiale del preventivo cancellato con successo' });
        } else {
            res.status(404).json({ message: 'Materiale del preventivo non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la cancellazione del materiale del preventivo' });
    }
};
