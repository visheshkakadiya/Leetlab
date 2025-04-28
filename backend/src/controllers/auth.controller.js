import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from "../utils/auth.utils.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        })
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await db.user.update({
            where: {id: userId},
            data: {refreshToken}
        })

        return {accessToken, refreshToken}
    } catch (error) {
        console.log("Error generating access and refresh token: ", error)
        res.status(500).json({
            success: false,
            message: "Error generating access and refresh token"
        })
    }
}

const register = async (req, res) => {
    const {name, email, password} = req.body

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

        const newUser = await db.user.create({
             data: {
                email,
                name,
                password: hashedPassword,
                role: UserRole.USER
             }
        })

        if(!newUser) {
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
    const {email, password} = req.body

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await verifyPassword(password, user.password)

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id);

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

export {
    register,
    login,
    logout,
    check
}