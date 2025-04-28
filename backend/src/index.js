import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to leetlab")
})


import authRoutes from "./routes/auth.routes.js";
import problemRoutes from './routes/problem.routes.js'

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})