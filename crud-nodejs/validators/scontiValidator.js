const { validateString, validateNumber } = require('./validationUtils');
const db = require('../config/database');

const validateSconto = async (req, res, next) => {
    try {
        const sconto = req.body;
        
        // Validazione nome
        validateString(sconto.sconto_name, 'Nome sconto', {
            maxLength: 255
        });

        // Validazione percentuale
        validateNumber(sconto.sconto_percentuale, 'Percentuale di sconto', {
          min: 0,
          max: 100,
          required: false,
          isDecimal: true,
          maxDecimalPlaces: 2,
          maxLength: 5
        })
        
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = validateSconto;