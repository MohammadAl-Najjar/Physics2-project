import { Router } from "express"
import { createPost, getPosts, getPost, getMyPosts } from "./postsControllers.js"
import multer from "multer"
import path from "path"
import { requireAuth } from "../auth/authMiddleware.js";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const postsRouter = Router();

postsRouter.post("/", requireAuth, upload.single('image'), createPost);
postsRouter.get("/", getPosts);
postsRouter.get("/user/me", requireAuth, getMyPosts);
postsRouter.get("/:id", getPost);

export default postsRouter;