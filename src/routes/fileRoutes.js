import express from 'express';
import * as fileController from '../controllers/fileController.js';
import { upload } from "../config/multer.js";

const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/list', fileController.listFiles);
router.delete('/delete/:id', fileController.deleteFileById);
router.put('/update/:id', upload.single('file'), fileController.updateFileById);
router.get('/download/:id', fileController.downloadFileById);
router.get('/:id', fileController.listFileById);

export default router;