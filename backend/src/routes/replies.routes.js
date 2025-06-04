import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    addReply,
    updateReply,
    deleteReply,
    getDiscussionReplies
} from "../controllers/replies.controller.js";

const router = Router();

router.post("/add-reply/:discussionId", authMiddleware, addReply);
router.patch("/update-reply/:replyId", authMiddleware, updateReply);
router.delete("/delete-reply/:replyId", authMiddleware, deleteReply);
router.get("/get-replies/:discussionId", authMiddleware, getDiscussionReplies);

export default router