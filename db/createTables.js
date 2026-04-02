import { openConnection } from "./openDbConnection.js"

const db = await openConnection();

async function createUsersTable() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'instructor')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
}

async function createPostsTable() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        image_url TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `)
}

async function createAnswersTable() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
        )
    `)
}

async function createIndexes() {
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_answers_post_id ON answers(post_id);    
    `)

    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_answers_post_id ON answers(post_id);    
    `)
}



await createUsersTable();
await createPostsTable();
await createAnswersTable();
await createIndexes();

await db.close();