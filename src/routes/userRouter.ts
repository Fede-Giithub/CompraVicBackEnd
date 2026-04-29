import { Router } from "express"
import AuthController from "../controllers/userController"
import limiter from "../middleware/rateLimitMiddleware"
import userMiddleware from "../middleware/userMiddleware"

const userRouter = Router()

// http://localhost:3000/auth/register
userRouter.post("/register",limiter, AuthController.register)
// http://localhost:3000/auth/login
userRouter.post("/login",limiter, AuthController.login)
// http://localhost:3000/auth/create-admin (solo admin)
userRouter.post("/create-admin", userMiddleware, limiter, AuthController.createAdmin)

export default userRouter