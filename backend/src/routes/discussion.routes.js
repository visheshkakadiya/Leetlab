import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { 
    createDiscussion, 
    getAllDiscussions, 
    getDiscussionById, 
    updateDiscussion, 
    deleteDiscussion
} from "../controllers/discussion.controller.js";

const router = Router();

router.post("/create-discussion", authMiddleware, createDiscussion);
router.get("/get-all-discussions", authMiddleware, getAllDiscussions);
router.get("/get-discussion/:discussionId", authMiddleware, getDiscussionById);
router.put("/update-discussion/:discussionId", authMiddleware, updateDiscussion);
router.delete("/delete-discussion/:discussionId", authMiddleware, deleteDiscussion);

export default router