import express from "express";
import { 
    login, 
    logout, 
    register,
    currentUser,
    refreshAccessToken,
    resetPassword,
    forgotPassword,
    updateProfile
} from "../controllers/auth.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { upload } from "../middlewares/multer.middleware.js"
import { validate } from "../middlewares/validator.middleware.js";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    updateProfileSchema
} from "../validators/auth.validate.js"

const router = express.Router();

router.post("/register", validate(registerSchema), upload.single('avatar'), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", authMiddleware, logout)
router.get("/me", authMiddleware, currentUser)
router.post("/refreshToken", refreshAccessToken)
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword)
router.post("/update-profile", validate(updateProfileSchema), authMiddleware, updateProfile)

export default router