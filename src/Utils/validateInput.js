export function validateName(str, content){
    validateExist(str, content);
    if (typeof str !== "string") 
        throw new Error(`${content} must be a string`);
    if (str.length <= 1)
        throw new Error(`${content} must be more than a character`);
    if (/[^a-zA-Z]/.test(str)) 
        throw new Error(`${content} must contain alphabetical characters`);
}

export function validateNumber(value, content, type){
    validateExist(value, content);
    if (typeof value !== 'number' || Number.isNaN(value)) 
        throw new Error(`${content} must be an existing number`);
    switch (type){
        case "Integer":
            if (!Number.isInteger(value))
                throw new Error(`${content} must be of type ${type}`);
            break;
        case "Fraction":
            if (Number.isInteger(value))
                throw new Error(`${content} must be of type ${type}`);
            break;
    }
}

export function validateType(value, content, expectedType) {
    if (expectedType === String) expectedType = "string";
    if (expectedType === Number) expectedType = "number";
    if (expectedType === Boolean) expectedType = "boolean";

    if (typeof expectedType === 'string') {
        if (typeof value !== expectedType.toLowerCase()) {
            throw new Error(`${content} must be of type ${expectedType}`);
        }
        return;
    }

    if (typeof expectedType === 'function') {
        if (!(value instanceof expectedType)) {
             throw new Error(`${content} must be an instance of ${expectedType.name}`);
        }
    }
}

export function validateExist(value, content){
    if(value == undefined || value == null || value == NaN)
        throw new Error(`${content} must be an existing value`);
}