import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const init = async () => {
    console.log('Initializing database ...');

    try {
        const conn = await pool.getConnection();

        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                password_hash VARCHAR(255) NOT NULL
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                extension VARCHAR(32) NOT NULL,
                mime VARCHAR(255) NOT NULL,
                size BIGINT NOT NULL,
                loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        conn.release();
    }
    catch (err) {
        console.error('Error creating table:', err);
    }
};
