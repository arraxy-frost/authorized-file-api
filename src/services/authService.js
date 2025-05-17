import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES
} = process.env;

const ALGORITHM = 'HS256';

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are missing in .env');
}

export const generateTokenPair = id => {
    const accessToken = jwt.sign({
       sub: id,
    }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES,
        algorithm: ALGORITHM,
    });

    const refreshToken = jwt.sign({
        sub: id,
    }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES,
        algorithm: ALGORITHM,
    });

    return {
        accessToken,
        refreshToken
    };
};

export const extractUserDataFromAccessToken = token => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET, {
            algorithms: [ALGORITHM],
        });
    }
    catch (err) {
        return null;
    }
};

export const getNewAccessToken = (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
        return {
            success: false,
            message: 'Refresh token is invalid',
        };
    }

    const newAccessToken = jwt.sign({
        sub: decoded.sub,
    }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES,
        algorithm: ALGORITHM,
    });

    return {
        success: true,
        accessToken: newAccessToken,
    }
}
