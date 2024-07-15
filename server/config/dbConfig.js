import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT ,
    database: process.env.DB_NAME,
    ssl:{
        rejectUnauthorized: false,
    }
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Connected to the database:', res.rows[0]);
    }
});

export default pool;
