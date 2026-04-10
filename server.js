import express from 'express'
import path from 'node:path'
import { authRouter } from './apis/auth/authRoutes.js';
import 'dotenv/config'
import cors from 'cors'
import postsRouter from './apis/posts/postsRoutes.js';
import answersRouter from './apis/answers/answersRoutes.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const PORT = 8000;

const app = express();
// middleware
if (process.env.NODE_ENV === "production") {
    app.use(helmet());
    app.set('trust proxy', 1);
}
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join('frontend')));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/posts/:postId/answers", answersRouter);
app.listen(PORT);