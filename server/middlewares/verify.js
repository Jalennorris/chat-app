import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/authConfig.js';
import pool from '../config/dbConfig.js'; // Assuming dbConfig.js exports the pool

export async function verify(req, res, next) {
    try {
        const authHeader = req.headers.cookie; // Get the session cookie from the request header

        if (!authHeader) {
            return res.sendStatus(401); // If there is no cookie from the request header, send an unauthorized response.
        }

        const token = authHeader.split('=')[1]; // Split the cookie string to get the actual JWT

        // Verify the JWT to see if the token has been tampered with or if it has expired.
        jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // If the token has been altered or has expired, return an unauthorized error
                return res.status(401).json({ message: 'This session has expired. Please login' });
            }

            const { userId } = decoded; // Assuming the JWT payload contains the user ID as 'userId'
            const user = await pool.query('SELECT * FROM "user" WHERE user_id = $1', [userId]);
            
            if (!user.rows[0]) {
                return res.status(401).json({ message: 'User not found' });
            }

            const { password, ...userData } = user.rows[0]; // Assuming you only need the first row of the query result
            req.user = userData;
            next();
        }); // Added missing closing parenthesis
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Internal Server Error',
        });
    }
}

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};

export function verifyRole(req, res, next) {
    try {
        const user = req.user; // We have access to the user object from the request
        const { role } = user; // Extract the user role

        // Check if the user is unauthorized (not an admin)
        if (role !== "admin") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }

        next(); // Continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error,",

        });
    }
}