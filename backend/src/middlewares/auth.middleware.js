import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const authMiddleware = async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            throw new ApiError(401, "Unauthorized")
        }

        req.user = decoded;
        next()

    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
}