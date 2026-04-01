import express from "express"
import { registerController, loginController, sessionController, logoutController } from "./authControllers.js"

export const authRouter = express.Router();

authRouter.get('/session', sessionController);
authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/logout', logoutController);