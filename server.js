import express from 'express'
import path from 'node:path'
import { authRouter } from './apis/auth/authRoutes.js';
import 'dotenv/config'
import session from 'express-session'
import cors from 'cors'
import postsRouter from './apis/posts/postsRoutes.js';

const PORT = 8000;

const app = express();
// middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}))
app.use(express.static(path.join('frontend')));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });