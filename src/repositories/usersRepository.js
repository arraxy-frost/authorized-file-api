import * as db from '../config/db.js';

export const createUser = async (id, passwordHash) => {
    const [result] = await db.pool.query(
        `INSERT INTO users (id, password_hash) VALUES (?, ?)`,
        [id, passwordHash]
    );

    return result.affectedRows > 0;
}

export const findUserById = async (id) => {
    const [rows] = await db.pool.query(
        `SELECT * FROM users WHERE id = ?`,
        [id]
    );

    return rows[0];
}