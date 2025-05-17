import * as db from '../config/db.js';
import { v4 as uuid } from 'uuid';

export const createSession = async (userId, refreshHash) => {
    const [result] = await db.pool.query(
        `INSERT INTO sessions (id, user_id, refresh_hash) VALUES (?, ?, ?)`,
        [uuid(), userId, refreshHash]
    );

    return result.affectedRows > 0;
};

export const findSessionById = async (id) => {
    const [rows] = await db.pool.query(
        `SELECT * FROM sessions WHERE id = ?`,
        [id]
    );

    return rows[0];
};

export const updateSession = async (id, refreshHash) => {
    const [result] = await db.pool.query(
        `UPDATE sessions SET refresh_hash = ? WHERE id = ?`,
        [refreshHash, id]
    );

    return result.affectedRows > 0;
};

export const deleteSession = async (id) => {
    const [result] = await db.pool.query(
        `DELETE FROM sessions WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};

export const findSessionByRefreshHash = async (refreshHash) => {
    const [rows] = await db.pool.query(
        `SELECT * FROM sessions WHERE refresh_hash = ?`,
        [refreshHash]
    );

    return rows[0];
}