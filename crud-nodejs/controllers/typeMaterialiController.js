const TypeMaterialiModel = require('../models/dbModels');

exports.getAllTypeMateriali = async (req, res) => {
    try {
        const typeMateriali = await TypeMaterialiModel.getAllTypeMateriali();
        res.json(typeMateriali);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Errore del server.' });
    }
};

exports.getTypeMaterialeById = async (req, res) => {
    try {
        const data = await TypeMaterialiModel.getTypeMaterialeById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Tipo materiale non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero del tipo materiale' });
    }
};

exports.createTypeMateriale = async (req, res) => {
    try {
        const typeMateriale = await TypeMaterialiModel.createTypeMateriale(req.body);
        res.status(201).json(typeMateriale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Errore del server.' });
    }
};

exports.updateTypeMateriale = async (req, res) => {
    try {
        const result = await TypeMaterialiModel.updateTypeMateriale(req.params.id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: 'Tipo materiale aggiornato con successo' });
        } else {
            res.status(404).json({ message: 'Tipo materiale non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del tipo materiale' });
    }
};

exports.deleteTypeMateriale = async (req, res) => {
    try {
        const result = await TypeMaterialiModel.deleteTypeMateriale(req.params.id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Tipo materiale cancellato con successo' });
        } else {
            res.status(404).json({ message: 'Tipo materiale non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la cancellazione del tipo materiale' });
    }
};
