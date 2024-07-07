import pool from '../config/dbConfig.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export default {
    onGetAllUsers: async (req, res) => {
        try {
            const allUsers = await pool.query('SELECT * FROM "user"');
            res.status(200).json(allUsers.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    onGetUserById: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Check if the id is a number (assuming user_id) or a string (assuming user_name)
            if (!isNaN(id)) {
                // If id is a number, search by user_id
                const user = await pool.query('SELECT * FROM "user" WHERE user_id = $1', [id]);
                if (user.rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json(user.rows[0]);
            } else {
                // If id is not a number, assume it's user_name and search by user_name
                const user = await pool.query('SELECT * FROM "user" WHERE user_name = $1', [id]);
                if (user.rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json(user.rows[0]);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ,
    onCreateUser : async (req, res) => {
        const { first_name, last_name, email, phone, user_name, password } = req.body;
        try {
          // Check if username or email already exists
          const existingUser = await pool.query('SELECT * FROM "user" WHERE user_name = $1 OR email = $2', [user_name, email]);
          if (existingUser.rows.length > 0) {
            const existingField = existingUser.rows[0].user_name === user_name ? 'Username' : 'Email';
            return res.status(400).json({ message: `${existingField} already exists` });
          }
      
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, saltRounds);
      
          // Proceed with user registration
          const newUser = await pool.query('INSERT INTO "user" (first_name, last_name, email, phone, user_name, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [first_name, last_name, email, phone, user_name, hashedPassword]);
          
          // Respond with the newly created user
          res.status(201).json(newUser.rows[0]);
        } catch (error) {
          // Handle server errors
          console.error('Error registering user:', error);
          res.status(500).json({ message: 'Server Error' });
        }
      }
      
      
      ,
    onUpdateUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, email, phone, user_name } = req.body;
            await pool.query('UPDATE "user" SET first_name = $1, last_name = $2, email = $3 , phone = $4, user_name = $5 WHERE user_id = $6', [first_name, last_name, email, phone, user_name, id]);
            res.status(200).json({ message: 'User has been updated!' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    onDeleteUserById: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM "user" WHERE user_id = $1', [id]);
            res.status(200).json({ message: 'User has been deleted!' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    loginUser: async (req, res) => {
        try {
          const { user_name, password } = req.body;
          const result = await pool.query('SELECT * FROM "user" WHERE user_name = $1', [user_name]);
          const user = result.rows[0];
          if (!user) {
            return res.status(401).json({ message: "Invalid username" });
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
          }
      
          const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1d' }); // 1 day
          res.cookie('SessionID', token, {
            maxAge:  24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          });
          res.status(200).json({ status: "success", message: "You have successfully logged in.", user_name: user_name, user_id: user.user_id });
        } catch (error) {
          console.error('Error logging in:', error);
          res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
      },
      getUserThemeColor: async(req,res) =>{
        try {
            const { id } = req.params;
            const user = await pool.query('SELECT theme_color FROM "user" WHERE user_id = $1', [id]);
            res.status(200).json(user.rows[0]);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      updateUserThemeColor: async(req,res) =>{
        try {
            const { id } = req.params;
            const { theme_color } = req.body;
            await pool.query('UPDATE "user" SET theme_color = $1 WHERE user_id = $2', [theme_color, id]);
            res.status(200).json({ message: 'User Theme Color has been updated!' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });

            
        }

      },
    logout: async (req, res) => {
        try {
            const authHeader = req.headers['cookie'];
            if (!authHeader) return res.sendStatus(204);
            const cookie = authHeader.split('=')[1];
            const accessToken = cookie.split(';')[0];

            const checkIfBlacklisted = await pool.query('SELECT * FROM blacklist WHERE token = $1', [accessToken]);
            if (checkIfBlacklisted.rows.length > 0) return res.sendStatus(204);

            await pool.query('INSERT INTO blacklist (token) VALUES ($1)', [accessToken]);

            res.setHeader('Clear-Site-Data', '"cookies"');
            res.status(200).json({ message: 'You are logged out!' });
        } catch (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
};
