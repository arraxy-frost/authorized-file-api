import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import { extractTokenFromHeader } from "../utils/extractTokenFromHeader.js";
import { tokenWhiteList } from "../config/cache.js";

export const signUp = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        res.status(400).send({
            message: 'id or password is missing in body',
        });
    }

    try {
        await userService.createUser(id, password);

        const { refreshToken, accessToken, session } = await initSession(id);

        setSecuredCookies(res, refreshToken, session.id);

        console.log(accessToken, refreshToken, accessToken, session.id);
        return res.json({
            access_token: accessToken,
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};

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

    const { refreshToken, accessToken, session } = await initSession(id);

    setSecuredCookies(res, refreshToken, session.id);

    return res.json({
        access_token: accessToken,
    });
};

export const signInNewToken = async (req, res) => {
    try {
        const cookieToken = req.cookies.refreshToken;

        if (!cookieToken) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const { accessToken, refreshToken, session } = await authService.refreshSession(cookieToken);

        tokenWhiteList.set(session.id, accessToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES),
            path: '/signin/new_token',
        });

        return res.json({
            accessToken
        });
    }
    catch (err) {
        return res.status(401).json({
            message: err.message
        });
    }
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

    tokenWhiteList.del(sessionId);

    return res.json({
        request: 'logout success'
    })
};


const setSecuredCookies = (res, refreshToken, sessionId) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES),
        path: '/signin/new_token',
    });

    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/logout',
    });
}

const initSession = async (userId) => {
    const refreshToken = authService.generateRefreshToken(userId);

    await authService.createSession(userId, refreshToken);
    const session = await authService.getSessionByRefreshToken(refreshToken);

    const accessToken = authService.generateAccessToken(userId, session.id);
    tokenWhiteList.set(session.id, accessToken);

    return {
        accessToken,
        refreshToken,
        session,
    }
}
