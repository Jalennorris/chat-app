// utils/validateMessage.js
export function isValidMessage(message, maxLength) {
    return message.trim().length > 0 && message.length <= maxLength;
}
