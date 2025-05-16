import * as db from '../config/db.js';

export const createUser = async (id, passwordHash) => {
    const [result] = await db.pool.query(
        `INSERT INTO users (id, password_hash) VALUES (?, ?)`,
        [id, passwordHash]
    );

    return result.affectedRows > 0;
}
