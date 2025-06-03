import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to leetlab")
})


import authRoutes from "./routes/auth.routes.js";
import problemRoutes from './routes/problem.routes.js'
import executionRoute from './routes/executeCode.routes.js'
import submissionRoutes from './routes/submission.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import discussionRoutes from './routes/discussion.routes.js'
import toggleRoutes from './routes/toggle.routes.js'

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executionRoute)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/discussion", discussionRoutes)
app.use("/api/v1/toggle", toggleRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})