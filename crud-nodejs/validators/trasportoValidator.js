const { validateString, validateNumber } = require('./validationUtils');
const db = require('../config/database');

const validateTrasporto = async (req, res, next) => {
    try {
        const trasporto = req.body;
        
        // Validazione nome
        validateString(trasporto.trasporto_name, 'Nome trasporto', {
            maxLength: 255
        });

        //Validazione distanza in km
        validateNumber(trasporto.trasporto_distanza_km, 'Distanza in km', {
          min:1,
          isInteger: true
        });

        // Validazione costo del trasporto
        validateNumber(trasporto.trasporto_costo, 'Costo del trasporto', {
          min: 1,
          isDecimal: true,
          maxDecimalPlaces: 2,
          maxLength: 10
        })
        
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = validateTrasporto;