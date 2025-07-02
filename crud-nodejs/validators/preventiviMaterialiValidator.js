const { validateNumber } = require('./validationUtils');
const db = require('../config/database');

const validatePreventivoMateriale = async (req, res, next) => {
  try {
    const preventivoMateriale = req.body;

    // Validazione quantità
    validateNumber(preventivoMateriale.preventivo_mat_quantita, 'Quantità', {
      required: true,
      isInteger: true,
      min: 1
    });

    // Validazione id preventivo materiale (foreign key)
    if (preventivoMateriale.preventivo_mat_id) {
      validateNumber(preventivoMateriale.preventivo_mat_id, 'Preventivo materiale', {
        min: 1,
        isInteger: true
      });

      // Verifica esistenza del id preventivo materiale
      const [preventivoMateriale] = await db.query(
        'SELECT preventivo_mat_id FROM preventivi_materiali WHERE preventivo_mat_id = ?',
        [preventivoMateriale.preventivo_mat_id]
      );

      if (!preventivoMateriale.length) {
        throw new Error('Il tipo preventivo materiale specificato non esiste');
      }
    };

    // Validazione id del materiale della tabella materiale preventivo (foreign key)
    if (preventivoMateriale.preventivo_mat_mat_id) {
      validateNumber(preventivoMateriale.preventivo_mat_mat_id, 'Materiale del preventivo materiale applicato', {
        min: 1,
        isInteger: true
      });

      // Verifica esistenza del id materiale del preventivo
      const [materialePreventivo] = await db.query(
        'SELECT materiale_id FROM materiali WHERE materiale_id = ?',
        [preventivoMateriale.preventivo_mat_mat_id]
      );

      if (!materialePreventivo.length) {
        throw new Error('Il materiale specificato non esiste');
      }
    };

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = validatePreventivoMateriale;