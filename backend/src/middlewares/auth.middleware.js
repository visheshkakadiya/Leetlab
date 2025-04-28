import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) {
            return res.status(401).json({
                success: false, 
                message: "Unauthorized"
            })
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next()

    } catch (error) {
        console.log("Error authenticating user: ", error)
        res.status(500).json({
            success: false,
            message: "Error authenticating user"
        })
    }
}

export const checkAdmin = async(req, res, next) => {

    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true,
            }
        })

        if(!user || user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Access denied - Admins only"
            })
        }
    } catch (error) {
        console.log("Error checking Admin role: ", error);
        res.status(500).json({
            message: "Error checking admin role"
        })
    }

}