import jwt from 'jsonwebtoken'
import {extractTokenFromHeader} from "../utils/extractTokenFromHeader.js";

export default (req, res, next) => {
    const openPaths = [
        '/signup',
        '/signin',
        '/signin/new_token'
    ];

    if (openPaths.includes(req.path)) {
        return next();
    }

    const accessToken = extractTokenFromHeader(req);

    if (!accessToken) {
        return res.status(401).json({
            message: 'Access token is missing',
        });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = { id: decoded.sub };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}