import * as db from '../config/db.js';

export const saveFileData = async (name, extension, mime, size) => {
    const [result] = await db.pool.query(
        `INSERT INTO files (name, extension, mime, size) VALUES (?, ?, ?, ?)`,
        [name, extension, mime, size]
    );

    return result.affectedRows > 0;
}

export const listFiles = async (limit, page) => {
    const [rows] = await db.pool.query(
        `SELECT * FROM files ORDER BY loaded_at DESC LIMIT ? OFFSET ?;`,
        [limit, (page - 1) * limit]
    );

    const [[{count}]] = await db.pool.query('SELECT COUNT(*) as count FROM files');

    return {
        page,
        limit,
        rowCount: count,
        totalPages: Math.ceil(count / limit),
        data: rows
    };
}

export const deleteFileById = async (id) => {
    const [result] = await db.pool.query(
        `DELETE FROM files WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
}

export const findFileById = async (id) => {
    const [rows] = await db.pool.query(`SELECT * FROM files WHERE id = ?`, [id]);
    return rows[0];
}

export const updateFileById = async (id, name, extension, mime, size) => {
    const [result] = await db.pool.query(
        `UPDATE files SET name = ?, extension = ?, mime = ?, size = ? WHERE id = ?`,
        [name, extension, mime, size, id]
    );

    return result.affectedRows > 0;
}
