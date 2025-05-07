import { db } from "../libs/db.js";
import crypto from 'crypto'
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from "../utils/auth.utils.js";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiResponse.js'
import { forgotPasswordGenContent, sendMail } from "../utils/mail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await db.user.update({
            where: { id: userId },
            data: { refreshToken }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("Error generating access and refresh token: ", error)
        res.status(500).json({
            success: false,
            message: "Error generating access and refresh token"
        })
    }
}

const register = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const existedUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const hashedPassword = await hashPassword(password)

        const avatarLocalPath = req.file?.path;

        if (!avatarLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Avatar is required"
            })
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            return res.status(500).json({
                success: false,
                message: "Error uploading avatar"
            })
        }

        const newUser = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                imageUrl: avatar.secure_url,
                imageId: avatar.public_id,
                role: UserRole.USER
            }
        })

        if (!newUser) {
            return res.status(500).json({
                success: false,
                message: "Error creating user"
            })
        }

        res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image
            },
            message: "User created successfully"
        })

    } catch (error) {
        console.log("Error registering user: ", error)
        res.status(500).json({
            success: false,
            message: "Error registering user"
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await verifyPassword(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);

        const options = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            },
            message: "User logged in successfully"
        })

    } catch (error) {
        console.log("Error logging in user: ", error)
        res.status(500).json({
            success: false,
            message: "Error logging in user"
        })
    }
}

const logout = async (req, res) => {
    try {

        const { userId } = req.user?.id;

        if (userId) {
            await db.user.update({
                where: { id: userId },
                data: { refreshToken: null }
            })
        }

        const options = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

        res.clearCookie("accessToken", options)
        res.clearCookie("refreshToken", options)

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log("Error logging out user: ", error)
        res.status(500).json({
            success: false,
            message: "Error logging out user"
        })
    }
}

const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        })
    } catch (error) {
        console.log("Error checking user: ", error)
        res.status(500).json({
            success: false,
            message: "Error checking user"
        })
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized, please login again")
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await db.user.findUnique({
        where: {
            id: decoded.id
        }
    })
    if (!user) {
        throw new ApiError(401, "Token expired, please login again")
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user.id)

    const options = {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    res.cookie("accessToken", accessToken, options)
    res.cookie("refreshToken", newRefreshToken, options)

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: newRefreshToken
        }
    })

    return res.status(200).json(
        new ApiResponse(200, null, "Access token refreshed successfully")
    )
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await db.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new ApiError(404, "Invalid email")
    }

    const token = crypto.randomBytes(32).toString("hex");
    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            resetPasswordToken: token,
            resetPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
    })

    const resetUrl = `${process.env.BASE_URL}/auth/reset-password/${token}`

    const mailGenContent = forgotPasswordGenContent(user.name, resetUrl)

    await sendMail({
        email: user.email,
        subject: "Reset Your Password",
        mailGenContent,
    })

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset link sent to your email")

    )
})

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
        throw new ApiError(400, "Invalid token")
    }

    const user = await db.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpiry: {
                gte: new Date()
            }
        }
    });

    if (!user) {
        throw new ApiError(404, "Invalid User token")
    }

    const hashedPassword = await hashPassword(newPassword)
    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null
        }
    })

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset successfully")
    )
})

const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body
    const userId = req.user.id

    if (!name || !email) {
        throw new ApiError(400, "Please provide all fields")
    }

    const updatedUser = await db.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
        },
    })

    if (!updatedUser) {
        throw new ApiError(500, "Error updating user")
    }

    return res.status(200).json(
        new ApiResponse(200, { user: updatedUser }, "Profile updated successfully")
    )
})

export {
    register,
    login,
    logout,
    check,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    updateProfile
}