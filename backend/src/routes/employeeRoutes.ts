import { Router } from 'express';

const router = Router();

router.get('/me', async (req, res) => {
    res.json({ id: 'e1', name: 'Employee 1', role: 'EMPLOYEE' });
});

export default router;
