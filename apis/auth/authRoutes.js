import express from "express"
import { registerController, loginController, sessionController, logoutController } from "./authControllers.js"
import { authLimiter } from "./authLimiter.js";

export const authRouter = express.Router();

authRouter.get('/session', sessionController);
authRouter.post('/register', authLimiter, registerController);
authRouter.post('/login', authLimiter, loginController);
authRouter.get('/logout', logoutController);