import pool from "../config/dbConfig.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export default {
    onGetAllUsers: async (req, res) => {
        try {
            const query = 'SELECT * FROM "user"';
            const { rows } = await pool.query(query);
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    onGetUserById: async (req, res) => {
        try {
            const { id } = req.params;

            const query = isNaN(id)
                ? 'SELECT * FROM "user" WHERE user_name = $1'
                : 'SELECT * FROM "user" WHERE user_id = $1';

            const { rows } = await pool.query(query, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    onCreateUser: async (req, res) => {
        const { first_name, last_name, email, phone, user_name, password } = req.body;
        try {
            // Check if username or email already exists
            const checkQuery = 'SELECT * FROM "user" WHERE user_name = $1 OR email = $2';
            const { rows: existingUsers } = await pool.query(checkQuery, [user_name, email]);

            if (existingUsers.length > 0) {
                const existingField = existingUsers[0].user_name === user_name ? 'Username' : 'Email';
                return res.status(400).json({ message: `${existingField} already exists` });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            const insertQuery = 'INSERT INTO "user" (first_name, last_name, email, phone, user_name, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const { rows: newUser } = await pool.query(insertQuery, [first_name, last_name, email, phone, user_name, hashedPassword]);

            res.status(201).json(newUser[0]);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    onUpdateUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, email, phone, user_name } = req.body;

            const updateQuery = 'UPDATE "user" SET first_name = $1, last_name = $2, email = $3, phone = $4, user_name = $5 WHERE user_id = $6 RETURNING *';
            const { rows: updatedUser } = await pool.query(updateQuery, [first_name, last_name, email, phone, user_name, id]);

            if (updatedUser.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User has been updated!' });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    onDeleteUserById: async (req, res) => {
        try {
            const { id } = req.params;

            const deleteQuery = 'DELETE FROM "user" WHERE user_id = $1';
            await pool.query(deleteQuery, [id]);

            res.status(200).json({ message: 'User has been deleted!' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { user_name, password } = req.body;

            const query = 'SELECT * FROM "user" WHERE user_name = $1';
            const { rows: users } = await pool.query(query, [user_name]);

            if (users.length === 0) {
                return res.status(401).json({ message: "Invalid username" });
            }

            const passwordMatch = await bcrypt.compare(password, users[0].password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ userId: users[0].user_id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1d' }); // 1 day
            res.cookie('SessionID', token, {
                maxAge:  24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            res.status(200).json({ status: "success", message: "You have successfully logged in.", user_name: user_name, user_id: users[0].user_id });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    },

    getUserThemeColor: async (req, res) => {
        try {
            const { id } = req.params;
            const query = 'SELECT theme_color FROM "user" WHERE user_id = $1';
            const { rows: userTheme } = await pool.query(query, [id]);

            if (userTheme.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(userTheme[0]);
        } catch (error) {
            console.error('Error fetching user theme color:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUserThemeColor: async (req, res) => {
        try {
            const { id } = req.params;
            const { theme_color } = req.body;

            const updateQuery = 'UPDATE "user" SET theme_color = $1 WHERE user_id = $2 RETURNING *';
            const { rows: updatedUser } = await pool.query(updateQuery, [theme_color, id]);

            if (updatedUser.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User Theme Color has been updated!' });
        } catch (error) {
            console.error('Error updating user theme color:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    logout: async (req, res) => {
        try {
            const authHeader = req.headers['cookie'];
            if (!authHeader) return res.sendStatus(204);
            const cookie = authHeader.split('=')[1];
            const accessToken = cookie.split(';')[0];

            const query = 'INSERT INTO blacklist (token) VALUES ($1)';
            await pool.query(query, [accessToken]);

            res.setHeader('Clear-Site-Data', '"cookies"');
            res.status(200).json({ message: 'You are logged out!' });
        } catch (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ status: 'error',})
        }
    }
}
