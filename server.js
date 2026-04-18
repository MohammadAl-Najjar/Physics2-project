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
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "data:", "https://*.supabase.co"],
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

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

export { app };