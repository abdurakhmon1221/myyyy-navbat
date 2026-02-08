import { Router } from 'express';
import { joinQueue, getMyQueues } from '../controllers/queueController';

const router = Router();

router.post('/join', async (req, res) => {
    joinQueue(req, res);
});

router.get('/my', async (req, res) => {
    getMyQueues(req, res);
});

export default router;
