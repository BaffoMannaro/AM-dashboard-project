const { validateNumber, validateString } = require('./validationUtils');
const db = require('../config/database');

const validateMateriale = async (req, res, next) => {
    try {
        const materiale = req.body;
        
        // Validazione nome
        validateString(materiale.materiale_name, 'Nome materiale', {
            maxLength: 255
        });
        
        // Validazione descrizione (opzionale)
        if (materiale.materiale_descr) {
            validateString(materiale.materiale_descr, 'Descrizione', {
                required: false
            });
        }
        
        // Validazione costo unitario
        validateNumber(materiale.materiale_costo_unit, 'Costo unitario', {
            min: 0
        });
        
        // Validazione prezzo unitario
        validateNumber(materiale.materiale_prezzo_unit, 'Prezzo unitario', {
            min: 0
        });
        
        // Validazione quantità
        validateNumber(materiale.materiale_quantity, 'Quantità', {
            min: 0,
            isInteger: true,
            required: false
        });
        
        // Validazione tipo materiale (foreign key)
        if (materiale.materiale_type_fk) {
            validateNumber(materiale.materiale_type_fk, 'Tipo materiale', {
                min: 1,
                isInteger: true
            });
            
            // Verifica esistenza del tipo materiale
            const [types] = await db.query(
                'SELECT type_mat_id FROM type_materiali WHERE type_mat_id = ?',
                [materiale.materiale_type_fk]
            );
            
            if (!types.length) {
                throw new Error('Il tipo materiale specificato non esiste');
            }
        }
        
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = validateMateriale;