import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/signin/new_token', authController.signInNewToken);
router.get('/info', authController.info);
router.get('/logout', authController.logout);

export default router;