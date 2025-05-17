import * as fileService from '../services/fileService.js'


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
    res.json({
        request: 'listFiles'
    });
};

export const deleteFileById = async (req, res) => {
    res.json({
        request: 'deleteFileById'
    });
};

export const getFileById = async (req, res) => {
    res.json({
        request: 'getFileById'
    });
};

export const downloadFileById = async (req, res) => {
    res.json({
        request: 'downloadFileById'
    });
};

export const updateFileById = async (req, res) => {
    res.json({
        request: 'updateFileById'
    });
};