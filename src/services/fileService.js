import * as fileRepository from '../repositories/filesRepository.js';
import fs from 'fs/promises';
import * as path from "node:path";

const UPLOAD_PATH = path.resolve(process.env.FILE_UPLOAD_PATH || 'uploads');

export const saveFile = async (file) => {
    try {
        const { originalname, mimetype, size, buffer } = file;

        const dbInsertResult = await fileRepository.saveFileData(
            originalname,
            path.extname(originalname),
            mimetype,
            size
        );

        if (dbInsertResult) {
            await fs.mkdir(UPLOAD_PATH, { recursive: true });
            await fs.writeFile(path.join(UPLOAD_PATH, originalname), buffer);
        }
        else {
            console.error('Database insert failed');
            return false;
        }

        return true;
    }
    catch (err) {
        console.error('File saving failed:', err);
        return false;
    }
}