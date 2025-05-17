import * as db from '../config/db.js';

export const saveFileData = async (name, extension, mime, size) => {
    const [result] = await db.pool.query(
        `INSERT INTO files (name, extension, mime, size) VALUES (?, ?, ?, ?)`,
        [name, extension, mime, size]
    );

    return result.affectedRows > 0;
}
