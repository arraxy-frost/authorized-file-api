import express from 'express';
import * as fileController from '../controllers/fileController.js';
import { upload } from "../config/multer.js";

const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/list', fileController.listFiles);
router.get('/download/:id', fileController.downloadFileById);
router.delete('/delete/:id', fileController.deleteFileById);
router.put('/update/:id', fileController.updateFileById);
router.get('/:id', fileController.getFileById);

export default router;