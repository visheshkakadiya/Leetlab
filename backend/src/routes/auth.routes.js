import express from "express";
import { 
    login, 
    logout, 
    register,
    check,
    refreshAccessToken,
    resetPassword,
    forgotPassword,
    updateProfile
} from "../controllers/auth.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)
router.get("/check", authMiddleware, check)
router.post("/refreshToken", refreshAccessToken)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/update-profile", authMiddleware, updateProfile)

export default router