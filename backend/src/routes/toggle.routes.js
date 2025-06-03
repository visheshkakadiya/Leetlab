import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    toggleUpVotes,
    toggleDownVotes,
    toggleReputation,
} from '../controllers/toggle.controller.js';

const router = Router();

router.post("/toggle-upvotes/:discussionId", authMiddleware, toggleUpVotes);
router.post("/toggle-downvotes/:discussionId", authMiddleware, toggleDownVotes);
router.post("/toggle-reputation/:userId", authMiddleware, toggleReputation);

export default router