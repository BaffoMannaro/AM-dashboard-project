// TABELLA materiali
// Implementa la logica di business per le operazioni CRUD

const MaterialiModel = require('../models/dbModels');
const UsuraMaterialiService = require('../services/usuraMaterialiService');

exports.getAllMateriali = async function(req, res) {
    try {
        const materiali = await MaterialiModel.getAllMateriali();
        res.json(materiali);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMaterialeById = async function(req, res) {
    try {
        // Usa req.params.id per compatibilità con GET /:id
        const materiale = await MaterialiModel.getMaterialeById(req.params.id);
        if (materiale) {
            res.json(materiale);
        } else {
            res.status(404).json({ message: 'Materiale non trovato' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMateriale = async function(req, res) {
    try {
        const materiale = await MaterialiModel.createMateriale(req.body);
        res.status(201).json(materiale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateMateriale = async function(req, res) {
    try {
        // Usa req.params.id invece di req.body.id per compatibilità con PUT /:id
        const materiale = await MaterialiModel.updateMateriale(req.params.id, req.body);
        res.json(materiale);
    } catch (err) {
        if (err.message.includes('non trovato')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
exports.deleteMateriale = async function(req, res) {
    try {
        // Usa req.params.id per compatibilità con DELETE /:id
        const result = await MaterialiModel.deleteMateriale(req.params.id);
        res.json(result);
    } catch (err) {
        if (err.message.includes('non trovato')) {
            res.status(404).json({ error: err.message });
        } else if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.message.includes('foreign key constraint')) {
            res.status(409).json({ error: 'Impossibile eliminare il materiale: è utilizzato in preventivi o ha dati di usura associati' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};


// Nuova funzione per ottenere materiali con tipo e filtri
exports.getMaterialiWithType = async function (req, res) {
    const filters = {
    name: req.body.name,
    minPrice: req.body.minPrice,
    maxPrice: req.body.maxPrice,
    type: req.body.type,
    orderBy: req.body.orderBy,
    orderDir: req.body.orderDir
  };

  try {
    const materiali = await MaterialiModel.getMaterialiWithType(filters);
    res.json(materiali);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

exports.calcolaUsura = async function(req, res) {
    try {
        const risultato = await UsuraMaterialiService.calcolaUsuraMateriale(
            req.body.materialeId,
            req.body.numeroUtilizzi
        );
        res.json(risultato);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verificaStatoUsura = async function(req, res) {
    try {
        const stato = await UsuraMaterialiService.verificaStatoUsura(req.body.materialeId);
        res.json(stato);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};