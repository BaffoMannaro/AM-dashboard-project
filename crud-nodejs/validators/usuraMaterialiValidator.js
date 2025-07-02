const { validateNumber, validateString } = require('./validationUtils');
const db = require('../config/database');

const validateUsuraMateriale = async (req, res, next) => {
    try {
        const usuraMateriale = req.body;
        
        // Validazione nome
        validateString(usuraMateriale.usura_mat_name, 'Nome usura materiale', {
            maxLength: 255
        });
        
        // Validazione percentuale usura
        validateNumber(usuraMateriale.usura_mat_percentuale_usura, 'Percentuale usura', {
            min: 0,
            max: 100,
            isDecimal: true
        });
        
        //Validazione vita restante
        validateString (usuraMateriale.usura_mat_vita_restante, 'Vita restante', {
            maxLength: 255
        });
        
        // Validazione id materiale (foreign key)
        if (usuraMateriale.materiale_id_fk) {
            validateNumber(usuraMateriale.materiale_id_fk, 'Materiale', {
                min: 1,
                isInteger: true
            });
            
            // Verifica esistenza del id materiale
            const [id] = await db.query(
                'SELECT materiale_id FROM materiali WHERE materiale_id = ?',
                [usuraMateriale.materiale_id_fk]
            );
            
            if (!id.length) {
                throw new Error('Il materiale specificato non esiste');
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

module.exports = validateUsuraMateriale;