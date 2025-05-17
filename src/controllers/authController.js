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

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/signin/new_token',
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

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/signin/new_token',
        });

        return res.json({
            access_token: accessToken,
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};

export const signInNewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = authService.getNewAccessToken(refreshToken);

    return res.json({
        accessToken
    })
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
    res.json({
        request: 'logout'
    })
};