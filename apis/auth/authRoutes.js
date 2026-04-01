import express from "express"
import { registerController, loginController } from "./authControllers.js"
import { logoutController } from "./authControllers.js"

export const authRouter = express.Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/logout', logoutController);