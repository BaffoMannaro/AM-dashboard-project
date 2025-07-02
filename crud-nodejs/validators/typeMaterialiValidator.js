const { validateString } = require('./validationUtils');
const db = require('../config/database');

const validateTypeMateriale = async (req, res, next) => {
    try {
        const type_materiale = req.body;
        
        // Validazione nome
        validateString(type_materiale.type_mat_name, 'Nome type materiale', {
            maxLength: 50
        });
        
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = validateTypeMateriale;
