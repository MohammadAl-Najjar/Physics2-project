import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import { authRouter } from './apis/auth/authRoutes.js';
import cors from 'cors'
import postsRouter from './apis/posts/postsRoutes.js';
import answersRouter from './apis/answers/answersRoutes.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const PORT = 8000;

const app = express();
// middleware
if (process.env.NODE_ENV === "production") {
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "img-src": ["'self'", "data:", "https://*.supabase.co", "https://*.supabase.in", "blob:"],
                "script-src": ["'self'", "'unsafe-inline'", "https://kit.fontawesome.com"],
                "connect-src": ["'self'", "https://ka-f.fontawesome.com", "https://*.supabase.co", "https://*.supabase.in"],
                "font-src": ["'self'", "https://ka-f.fontawesome.com", "data:"],
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    app.set('trust proxy', 1);
}
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/posts/:postId/answers", answersRouter);

import { getMyAnswers } from './apis/answers/answersControllers.js';
import { requireAuth } from './apis/auth/authMiddleware.js';
app.get("/api/user/answers", requireAuth, getMyAnswers);

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

export { app };