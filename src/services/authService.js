import * as dotenv from 'dotenv';
import * as usersRepository from '../repositories/usersRepository.js';
import jwt from 'jsonwebtoken';
import hashString from "../utils/hashString.js";

dotenv.config();

export const signIn = async (id, password) => {
    const passwordHash = await hashString(password);
    const result = await usersRepository.createUser(id, passwordHash);

    if (result) {
        const accessToken = jwt.sign(
            {
                id: result.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE,
            }
        );
        return {
            access_token: accessToken
        }
    } else {
        throw new Error("User has not created");
    }
};