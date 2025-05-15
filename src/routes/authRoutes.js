import express from 'express';

const router = express.Router();

router.get('/sign-in', (req, res) => {
    res.send('sign-in');
});

export default router;