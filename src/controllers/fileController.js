import * as fileService from '../services/fileService.js'
import * as path from "node:path";


export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'file not found'
        });
    }

    const savingResult = await fileService.saveFile(req.file);

    if (!savingResult) {
        return res.status(500).json({
            message: 'file saving failed'
        });
    }

    return res.json({
        message: 'file uploaded successfully',
    });
};

export const listFiles = async (req, res) => {
    const limit = parseInt(req.body.limit) ?? 10;
    const page = parseInt(req.body.page) ?? 1;

    const result = await fileService.listFiles(limit, page);

    if (!result) {
        return res.status(500).json({
            message: 'list files failed'
        })
    }

    return res.json(result);
};

export const deleteFileById = async (req, res) => {
    const id = parseInt(req.params.id);

    const deletionResult = await fileService.deleteFileById(id);

    if (!deletionResult) {
        return res.status(500).json({
            message: 'file deletion failed'
        });
    }

    return res.json(deletionResult);
};

export const listFileById = async (req, res) => {
    const findResult = await fileService.listFileById(req.params.id);

    if (!findResult) {
        return res.status(404).json({
            message: 'file not found'
        });
    }

    return res.json(findResult);
};

export const downloadFileById = async (req, res) => {
    const fileData = await fileService.listFileById(req.params.id);

    if (!fileData) {
        return res.status(404).json({
            message: 'file not found'
        });
    }

    const filePath = path.join(process.env.FILE_UPLOAD_PATH, fileData.name);

    return res.download(filePath, fileData.name, (err) => {
        if (err) {
            console.error('Error joining path:', err);
            return res.status(500).json({
                message: 'file not found on disk'
            });
        }
    });
};

export const updateFileById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!req.file) {
        return res.status(400).json({
            message: 'attach file to update'
        });
    }

    const updateResult = await fileService.updateFileById(id, req.file);

    if (!updateResult) {
        return res.status(500).json({
            message: 'update failed'
        })
    }

    return res.json({
        status: 'success',
        message: 'file updated successfully'
    });
};