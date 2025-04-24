import express from "express";
import { 
    login, 
    logout, 
    register,
    check
} from "../controllers/auth.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)
router.get("/check", authMiddleware, check)

export default router