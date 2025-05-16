import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import {extractTokenFromHeader} from "../utils/extractTokenFromHeader.js";

export const signIn = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).send({
            message: 'id or password is missing in body',
        });
    }

    const result = await userService.validateUser(id, password);

    if (!result) {
        return res.status(400).send({
            message: 'Password is incorrect',
        })
    }

    return res.json(authService.generateTokenPair(id));
};
export const signUp = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        res.status(400).send({
            message: 'id or password is missing in body',
        });
    }

    try {
        const result = await userService.createUser(id, password);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};
export const signInNewToken = async (req, res) => {
    // const { refreshToken } = req.body;

    return res.json({
        request: 'signInNewToken'
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