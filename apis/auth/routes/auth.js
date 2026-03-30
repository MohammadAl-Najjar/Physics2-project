import express from "express"
import { registerController, loginController } from "../controllers/authControllers.js"

export const authRouter = express.Router();

authRouter.post('/register', registerController);
authRouter.get('/login', loginController);