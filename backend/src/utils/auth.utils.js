import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        role: user.role
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        role: user.role
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken }