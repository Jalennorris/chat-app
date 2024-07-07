// utils/authHelpers.js
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/authConfig.js';

export function generateAuthToken(userId) {
    return jwt.sign({ userId }, SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
}

export function verifyAuthToken(token) {
    try {
        return jwt.verify(token, SECRET_ACCESS_TOKEN);
    } catch (error) {
        return null;
    }
}
