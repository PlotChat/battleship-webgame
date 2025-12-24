export function validateName(str, content){
    if (typeof str !== "string") 
        throw new Error(`${content} must be a string`);
    if (str.length <= 1)
        throw new Error(`${content} must be more than a character`);
    if (/[^a-zA-Z0-9]/.test(str)) 
        throw new Error(`${content} must not contain special characters`);
}