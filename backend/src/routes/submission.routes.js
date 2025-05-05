import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from '../controllers/submission.controller.js';

const router = express.Router();

router.get('/get-all-submissions', authMiddleware, getAllSubmission);
router.get('/get-submission/:problemId', authMiddleware, getSubmissionsForProblem);
router.get('/get-submissions-count/:problemId', authMiddleware, getAllTheSubmissionsForProblem);

export default router;