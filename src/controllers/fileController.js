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
    res.json({
        request: 'downloadFileById'
    });
};

export const updateFileById = async (req, res) => {
    return res.json({
        request: 'updateFileById'
    });
};