import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 5;

export default async (stringToHash) => {
    return await bcrypt.hash(stringToHash, SALT_ROUNDS);
};