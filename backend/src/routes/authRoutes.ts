import { Router } from 'express';
import { login, register, requestOtp, verifyOtp } from '../controllers/authController';

const router = Router();

router.post('/login', async (req, res) => {
    login(req, res);
});

router.post('/register', async (req, res) => {
    register(req, res);
});

router.post('/request-otp', async (req, res) => {
    requestOtp(req, res);
});

router.post('/verify-otp', async (req, res) => {
    verifyOtp(req, res);
});

export default router;
