import { openConnection } from "../../db/openDbConnection.js";

export async function createPost(req, res) {
    try {
        const { title, body, category } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const user_id = req.userId;

        if (!title || !body || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const db = await openConnection();

        await db.run(`
            INSERT INTO posts (title, body, category, image_url, user_id) VALUES (?, ?, ?, ?, ?)
        `, [title, body, category, image_url, user_id]);

        await db.close();
        return res.status(201).json({ message: "Post created successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPosts(req, res) {
    try {
        const db = await openConnection();
        const posts = await db.all(`
            SELECT posts.*, users.name as author, COUNT(answers.id) as answers_count
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN answers ON posts.id = answers.post_id
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
        `);
        await db.close();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPost(req, res) {
    try {
        const { id } = req.params;
        const db = await openConnection();
        const post = await db.get(`
            SELECT posts.*, users.name as author, COUNT(answers.id) as answers_count
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN answers ON posts.id = answers.post_id
            WHERE posts.id = ?
            GROUP BY posts.id
        `, [id]);
        await db.close();
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}