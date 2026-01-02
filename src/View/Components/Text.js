export function Text({ 
    content = "", 
    tag = "p",         
    size = "1.6rem",      
    variant = "default"
} = {}) {
    const textElement = document.createElement(tag);
    textElement.className = `text text--${variant}`
    textElement.style.fontSize = `${size}`
    textElement.textContent = content;

    return textElement;
}