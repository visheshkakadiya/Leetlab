import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { submitCode, runCodeOnly } from '../controllers/executeCode.controller.js';
import { validate } from "../middlewares/validator.middleware.js";
// import { executeCodeSchema } from "../validators/problem.validate.js";

const router = express.Router();

router.post("/run", authMiddleware, runCodeOnly);
router.post("/submit", authMiddleware, submitCode);

export default router;