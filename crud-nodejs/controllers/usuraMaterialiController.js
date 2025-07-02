// TABELLA usura_materiali
// Implementa la logica di business per le operazioni CRUD

const UsuraMaterialiModel = require('../models/dbModels');

exports.getAllUsuraMateriali = async (req, res) => {
    try {
        const data = await UsuraMaterialiModel.getAllUsuraMateriali();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dell\'usura dei materiali' });
    }
};

exports.getUsuraMaterialeById = async (req, res) => {
    try {
        const data = await UsuraMaterialiModel.getUsuraMaterialeById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Usura materiale non trovata' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dell\'usura materiale' });
    }
};

exports.getUsuraByMaterialeId = async (req, res) => {
    try {
        const data = await UsuraMaterialiModel.getUsuraByMaterialeId(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Dati di usura non trovati per questo materiale' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei dati di usura' });
    }
};

exports.createUsuraMateriale = async (req, res) => {
    try {
        const result = await UsuraMaterialiModel.createUsuraMateriale(req.body);
        res.status(201).json({ message: 'Usura materiale creata con successo', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione dell\'usura materiale' });
    }
};

exports.updateUsuraMateriale = async (req, res, next) => {
  try {
    const { usura_mat_id } = req.body; // ID dal corpo della richiesta
    const result = await UsuraMaterialiModel.updateUsuraMateriale(usura_mat_id, req.body); // Corretto da .update a .updateUsuraMateriale
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usura materiale non trovata' });
    }
    res.json({ message: 'Usura materiale aggiornata con successo' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUsuraMateriale = async (req, res, next) => {
  try {
    const { usura_mat_id } = req.body; // ID dal corpo della richiesta
    const result = await UsuraMaterialiModel.deleteUsuraMateriale(usura_mat_id); // Corretto da .delete a .deleteUsuraMateriale
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usura materiale non trovata' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
