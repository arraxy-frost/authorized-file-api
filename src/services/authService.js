import * as dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as sessionsRepository from '../repositories/sessionsRepository.js';

dotenv.config();

const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES
} = process.env;

const ALGORITHM = 'HS256';
const sha256 = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are missing in .env');
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({
        sub: userId,
    }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES,
        algorithm: ALGORITHM,
    });
};

export const generateAccessToken = (userId, sessionId) => {
    return jwt.sign({
        sub: userId,
        sessionId
    }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES,
        algorithm: ALGORITHM,
    });
};

export const extractUserDataFromAccessToken = token => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET, {
            algorithms: [ALGORITHM],
        });
    } catch (err) {
        return null;
    }
};

export const createSession = async (userId, refreshToken) => {
    const refreshHash = sha256(refreshToken);

    try {
        await sessionsRepository.createSession(userId, refreshHash);

        return {
            success: true,
            message: 'Session created successfully',
        }
    } catch (err) {
        console.error('Error creating session:', err);

        return {
            success: false,
            message: 'Failed to create session',
        }
    }
};

export const refreshSession = async (token) => {
    const session = await sessionsRepository.findSessionByRefreshHash(sha256(token));

    if (!session) throw new Error('Session not found. Refresh token is invalid');

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    if (!decoded) throw new Error('Refresh token is invalid');

    const accessToken = generateAccessToken(decoded.sub, session.id);
    const refreshToken = generateRefreshToken(decoded.sub);

    const updateResult = await sessionsRepository.updateSession(
        session.id,
        sha256(refreshToken)
    );

    if (!updateResult) throw new Error('Failed to update session');

    return {
        accessToken,
        refreshToken,
        session,
    }
};

export const getSessionByRefreshToken = async (refreshToken) => {
    const session = await sessionsRepository.findSessionByRefreshHash(sha256(refreshToken));

    if (!session) {
        return {
            success: false,
            message: 'Session not found. Refresh token is invalid',
        }
    }

    return session;
};

export const logoutSession = async (sessionId) => {
    const result = await sessionsRepository.deleteSession(sessionId);

    if (!result) {
        return {
            success: false,
            message: 'Failed to delete session',
        }
    }

    return {
        success: true,
        message: 'Session deleted successfully',
    }
}
