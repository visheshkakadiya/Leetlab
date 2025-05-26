import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { executeCode } from '../controllers/executeCode.controller.js';
import { validate } from "../middlewares/validator.middleware.js";
// import { executeCodeSchema } from "../validators/problem.validate.js";

const router = express.Router();

router.post("/", authMiddleware, executeCode);

export default router;