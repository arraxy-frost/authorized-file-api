import express from 'express';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();

router.post('/file/upload', fileController.uploadFile);
router.get('/file/list', fileController.listFiles);
router.get('/file/download/:id', fileController.downloadFileById);
router.delete('/file/delete/:id', fileController.deleteFileById);
router.put('/file/update/:id', fileController.updateFileById);
router.get('/file/:id', fileController.getFileById);

export default router;