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
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/register", upload.single('avatar'), register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)
router.get("/check", authMiddleware, check)
router.post("/refreshToken", refreshAccessToken)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/update-profile", authMiddleware, updateProfile)

export default router