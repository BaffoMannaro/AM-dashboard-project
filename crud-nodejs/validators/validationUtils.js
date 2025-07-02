const validateNumber = (value, fieldName, options = {}) => {
    const { min, max, isInteger, required = true, isDecimal = false, maxDecimalPlaces, maxLength } = options;
    
    if (required && (value === undefined || value === null)) {
        throw new Error(`${fieldName} è obbligatorio`);
    }
    
    if (value !== undefined && value !== null) {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`${fieldName} deve essere un numero valido`);
        }
        
        if (isInteger && !Number.isInteger(num)) {
            throw new Error(`${fieldName} deve essere un numero intero`);
        }
        
        if (isDecimal && maxDecimalPlaces !== undefined) {
            const decimals = num.toString().split('.')[1];
            if (decimals && decimals.length > maxDecimalPlaces) {
                throw new Error(`${fieldName} non può avere più di ${maxDecimalPlaces} decimali`);
            }
        }
        
        if (maxLength !== undefined && num.toString().length > maxLength) {
            throw new Error(`${fieldName} non può superare ${maxLength} caratteri`);
        }
        
        if (min !== undefined && num < min) {
            throw new Error(`${fieldName} deve essere maggiore o uguale a ${min}`);
        }
        
        if (max !== undefined && num > max) {
            throw new Error(`${fieldName} deve essere minore o uguale a ${max}`);
        }
    }
    return true;
};

const validateString = (value, fieldName, options = {}) => {
    const { minLength, maxLength, required = true } = options;
    
    if (required && !value) {
        throw new Error(`${fieldName} è obbligatorio`);
    }
    
    if (value) {
        if (typeof value !== 'string') {
            throw new Error(`${fieldName} deve essere una stringa`);
        }
    
        if (minLength !== undefined && value.length < minLength) {
            throw new Error(`${fieldName} deve contenere almeno ${minLength} caratteri`);
        }
    
        if (maxLength !== undefined && value.length > maxLength) {
            throw new Error(`${fieldName} deve contenere al massimo ${maxLength} caratteri`);
        }
    }
    return true;
};

const validateDate = (value, fieldName, options = {}) => {
    const { required = true } = options;
    
    if (required && !value) {
        throw new Error(`${fieldName} è obbligatorio`);
    }
    
    if (value) {
        if (typeof value !== 'string' || !/^\d{2}-\d{2}-\d{4}$/.test(value)) {
            throw new Error(`${fieldName} deve essere una data valida nel formato DD-MM-YYYY`);
        }
        // Convert DD-MM-YYYY to YYYY-MM-DD for Date object
        const [day, month, year] = value.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        if (isNaN(date.getTime())) {
            throw new Error(`${fieldName} non è una data valida`);
        }
    }
    return true;
};

module.exports = {
    validateNumber,
    validateString,
    validateDate
};