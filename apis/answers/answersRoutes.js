import { Router } from "express";
import { createAnswer, getAnswersForPost, getMyAnswers } from "./answersControllers.js";
import { requireAuth } from "../auth/authMiddleware.js";

const answersRouter = Router({ mergeParams: true });

answersRouter.post("/", requireAuth, createAnswer);

answersRouter.get("/", getAnswersForPost);

export default answersRouter;
