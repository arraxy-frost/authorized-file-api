import hashString from "../utils/hashString.js";
import * as usersRepository from "../repositories/usersRepository.js";
import bcrypt from "bcrypt";

export const createUser = async (id, password) => {
    const passwordHash = await hashString(password);
    const result = await usersRepository.createUser(id, passwordHash);

    if (result) {
        return {
            message: 'User created successfully',
        }
    } else {
        return {
            message: 'User creation failed',
        }
    }
}

export const validateUser = async (id, password) => {
    const user = await usersRepository.findUserById(id);

    if (user) {
        return await bcrypt.compare(password, user['password_hash']);
    }
    else {
        return false;
    }
}