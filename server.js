import express from 'express'
import path from 'node:path'
import { authRouter } from './apis/auth/routes/auth.js';
import 'dotenv/config'

const PORT = 8000;

const app = express();
// middleware
app.use(express.json());
app.use(express.static(path.join('frontend')));
app.use("/api/auth", authRouter);

app.listen(PORT,() => {console.log(`Listening on port ${PORT}`)});