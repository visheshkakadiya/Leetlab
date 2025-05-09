import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded) {
            return res.status(401).json({
                success: false, 
                message: "Unauthorized"
            })
        }

        req.user = decoded;
        next()

    } catch (error) {
        console.log("Error authenticating user: ", error)
        res.status(500).json({
            success: false,
            message: "Error authenticating user"
        })
    }
}