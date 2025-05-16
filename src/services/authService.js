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
        access_token: accessToken,
        refresh_token: refreshToken,
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
}