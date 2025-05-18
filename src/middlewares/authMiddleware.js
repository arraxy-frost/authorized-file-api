import jwt from 'jsonwebtoken'
import openPaths from "../config/openPaths.js";
import {extractTokenFromHeader} from "../utils/extractTokenFromHeader.js";
import {tokenWhiteList} from "../config/cache.js";

export default (req, res, next) => {
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

        const whiteListedToken = tokenWhiteList.get(decoded.sessionId);

        if (!whiteListedToken || (whiteListedToken !== accessToken)) {
            throw new Error('Token declined');
        }

        req.user = { id: decoded.sub };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: `Error token validation: ${err.message}`,  });
    }
}