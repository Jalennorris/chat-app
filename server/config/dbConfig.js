import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'punkin25',
    host: process.env.DB_HOST || "db.qejxbrgxatlteiirpnhj.supabase.co",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'chatdb',
});
export default pool;
