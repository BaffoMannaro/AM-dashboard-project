const { validateNumber, validateString, validateDate } = require('./validationUtils');
const db = require('../config/database');

const validatePreventivo = async (req, res, next) => {
  try {
    const preventivo = req.body;
    console.log('Validating preventivo:', JSON.stringify(preventivo, null, 2));

    // Validazione nome
    validateString(preventivo.preventivo_name, 'Nome preventivo', {
      maxLength: 255
    });

    // Validate descrizione (opzionale)
    if (preventivo.preventivo_descr) {
      validateString(preventivo.preventivo_descr, 'Descrizione preventivo', {
        required: false
      });
    };

    // Validazione data creazione preventivo (opzionale, ha un default)
    validateDate(preventivo.preventivo_data_creazione, 'Data creazione del preventivo', {
      required: false
    });

    // Validazione data evento nel preventivo
    validateDate(preventivo.preventivo_data_evento, 'Data dell\'evento', {
      required: true
    });

    // Validazione costo totale nel preventivo
    validateNumber(preventivo.preventivo_costo_totale, 'Costo totale', {
      required: true,
      isDecimal: true,
      min: 0
    });

    // Validazione id sconto (foreign key)
    if (preventivo.preventivo_sconto_id_fk) {
      validateNumber(preventivo.preventivo_sconto_id_fk, 'Sconto applicato', {
        min: 1,
        isInteger: true
      });

      // Verifica esistenza del id sconto
      const [sconti] = await db.query(
        'SELECT sconto_id FROM sconti WHERE sconto_id = ?',
        [preventivo.preventivo_sconto_id_fk]
      );

      if (!sconti.length) {
        throw new Error('Il tipo sconto specificato non esiste');
      }
    };

    // Validazione id trasporto (foreign key)
    if (preventivo.preventivo_trasporto_id_fk) {
      validateNumber(preventivo.preventivo_trasporto_id_fk, 'Trasporto applicato', {
        min: 1,
        isInteger: true
      });

      // Verifica esistenza del id trasporto
      const [trasporti] = await db.query(
        'SELECT trasporto_id FROM trasporto WHERE trasporto_id = ?',
        [preventivo.preventivo_trasporto_id_fk]
      );

      if (!trasporti.length) {
        throw new Error('Il tipo trasporto specificato non esiste');
      }
    };

    next();
  } catch (error) {
    console.error('Validation error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = validatePreventivo;