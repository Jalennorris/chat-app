import express from 'express';
import { verify, verifyRole } from '../middlewares/verify.js';

const router = express.Router();

router.get('/user', verify,(req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard!",
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*router.get("/admin", verify, verifyRole, (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to the Admin portal!",
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router; */
