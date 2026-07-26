import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors"

// custom import
import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executeCodeRouter from "./routes/executeCode.routes.js"
import submissionRouter from "./routes/submission.routes.js"
 
const app = express();

app.use(
    cors({
        origin: process.env.BASE_URL,
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())


app.use("/api/v1/user", userRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executeCodeRouter)
app.use("/api/v1/submission", submissionRouter)

export { app };
