import { Router } from "express"
import { createPost, getPosts, getPost } from "./postsControllers.js"
import multer from "multer"
import path from "path"
import { requireAuth } from "../auth/authMiddleware.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

const postsRouter = Router();

postsRouter.post("/", requireAuth, upload.single('image'), createPost);
postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPost);

export default postsRouter;