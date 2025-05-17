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

export const listFiles = async (limit, page) => {
    try {
        return await fileRepository.listFiles(limit, page);
    }
    catch (err) {
        console.error('Error listing files:', err);
        return false;
    }
}

export const deleteFileById = async (id) => {
    try {
        const fileToDelete = await fileRepository.findFileById(id);

        if (!fileToDelete) {
            console.error('File not found in database');
            return false;
        }

        const deletionResult = await fileRepository.deleteFileById(fileToDelete.id);

        if (deletionResult) {
            await fs.unlink(path.join(UPLOAD_PATH, fileToDelete.name));
            return fileToDelete;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error('Error getting file by ID:', err);
        return false;
    }
}

export const listFileById = async (id) => {
    try {
        const fileData = await fileRepository.findFileById(id);

        if (!fileData) {
            console.error('File not found in database');
            return false;
        }
        else {
            return fileData;
        }
    }
    catch (err) {
        console.error('Error getting file by id:', err);
        return false;
    }
}

export const updateFileById = async (id, file) => {
    try {
        const { originalname, mimetype, size, buffer } = file;

        const fileToUpdate = await fileRepository.findFileById(id);

        if (!fileToUpdate) {
            console.error('File not found in database');
            return false;
        }

        try {
            await fs.unlink(path.join(UPLOAD_PATH, fileToUpdate.name));
            await fs.writeFile(path.join(UPLOAD_PATH, originalname), buffer);
        } catch (err) {
            console.error('Error unlinking file:', err);
            return false;
        }

        const updateResult = await fileRepository.updateFileById(
            id,
            originalname,
            path.extname(originalname),
            mimetype,
            size
        );

        if (!updateResult) {
            console.error('File not found in database');
            return false;
        }

        return true;
    }
    catch (err) {
        console.error('Error updating file:', err);
        return false;
    }
}

