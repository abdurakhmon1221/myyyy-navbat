import { Router } from 'express';
import { getOrganizations, createOrganization } from '../controllers/orgController';
import { authenticate } from '../middleware/authMiddleware';
import { getEmployees } from '../controllers/employeeController';

const router = Router();

router.get('/', async (req, res) => {
    getOrganizations(req, res);
});

router.post('/', authenticate, async (req, res) => {
    createOrganization(req, res);
});

router.get('/:orgId/employees', async (req, res) => {
    getEmployees(req, res);
});

export default router;
