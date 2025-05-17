import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import { extractTokenFromHeader } from "../utils/extractTokenFromHeader.js";

export const signIn = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).send({
            message: 'id or password is missing',
        });
    }

    const result = await userService.validateUser(id, password);

    if (!result) {
        return res.status(401).send({
            message: 'Invalid id or password',
        })
    }

    const { accessToken, refreshToken } = authService.generateTokenPair(id);

    await authService.createSession(id, refreshToken);

    const session = await authService.getSessionByRefreshToken(refreshToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/signin/new_token',
    });

    res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/logout',
    });

    return res.json({
        access_token: accessToken,
    });
};

export const signUp = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        res.status(400).send({
            message: 'id or password is missing in body',
        });
    }

    try {
        await userService.createUser(id, password);

        const { accessToken, refreshToken } = authService.generateTokenPair(id);

        await authService.createSession(id, refreshToken);

        const session = await authService.getSessionByRefreshToken(refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/signin/new_token',
        });

        res.cookie('sessionId', session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/logout',
        });

        return res.json({
            access_token: accessToken,
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};

export const signInNewToken = async (req, res) => {
    const cookieToken = req.cookies.refreshToken;

    if (!cookieToken) {
        return res.status(401).json({
            message: 'Refresh token is missing',
        });
    }

    const { accessToken, refreshToken } = await authService.refreshSession(cookieToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/signin/new_token',
    });

    return res.json({
        accessToken
    });
};

export const info = async (req, res) => {
    const accessToken = extractTokenFromHeader(req);

    if (!accessToken) {
        return res.status(401).json({
            message: 'Access token is missing',
        });
    }

    try {
        const { sub } = authService.extractUserDataFromAccessToken(accessToken);

        return res.json({ id: sub });
    }
    catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired access token',
        });
    }
};

export const logout = async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({
            message: 'Session ID is missing',
        });
    }

    const logoutResult = await authService.logoutSession(sessionId);

    if (!logoutResult.success) {
        return res.status(500).json({
            message: 'Failed to logout',
        });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/signin/new_token',
    });

    res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/logout',
    });

    return res.json({
        request: 'logout success'
    })
};