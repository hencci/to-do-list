export const showInlineMessage = (elementId, message) => {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.color = "red";
    }
};

export const clearInlineMessage = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = "";
    }
};