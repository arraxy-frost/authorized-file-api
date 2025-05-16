import jwt from 'jsonwebtoken'
import {extractTokenFromHeader} from "../utils/extractTokenFromHeader.js";

export const authenticate = (req, res, next) => {
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