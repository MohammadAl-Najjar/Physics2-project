import express from 'express'
import path from 'node:path'
import { openConnection } from './db/openDbConnection.js';

const PORT = 8000;

const app = express();

const db = await openConnection();

const result = await db.get('SELECT * FROM users;')

await db.close()

console.log(result);

app.use(express.static(path.join('frontend')));

app.listen(PORT,() => {console.log(`Listening on port ${PORT}`)});