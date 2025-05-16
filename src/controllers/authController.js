import * as authService from '../services/authService.js';

export const signIn = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        res.status(400).send({
            message: 'id or password is missing in body',
        });
    }

    try {
        const result = await authService.signIn(id, password);

        res.json(result);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};
export const signInNewToken = async (req, res) => {
    res.json({
        request: 'signInNewToken'
    })
};
export const signUp = async (req, res) => {
    res.json({
        request: 'signUp'
    })
};
export const info = async (req, res) => {
    res.json({
        request: 'info'
    })
};
export const logout = async (req, res) => {
    res.json({
        request: 'logout'
    })
};