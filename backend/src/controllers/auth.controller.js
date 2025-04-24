import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

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

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
             data: {
                email,
                name,
                password: hashedPassword,
                role: UserRole.USER
             }
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const options = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

        res.cookie("token", token, options)

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
        console.log("Error creating user: ", error)
        res.status(500).json({
            success: false,
            message: "Error creating user"
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

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const options = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

        res.cookie("token", token, options)

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

        res.clearCookie("token", options)

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