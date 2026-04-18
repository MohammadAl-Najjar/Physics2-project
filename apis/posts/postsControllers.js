import { db } from "../../db/openDbConnection.js";

export async function createPost(req, res) {
    try {
        const { title, body, category } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const user_id = req.userId;

        if (!title || !body || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await db.query(`
            INSERT INTO posts (title, body, category, image_url, user_id) VALUES ($1, $2, $3, $4, $5)
        `, [title, body, category, image_url, user_id]);

        return res.status(201).json({ message: "Post created successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPosts(req, res) {
    try {
        const posts = await db.query(`
            SELECT posts.*, users.name as author, COUNT(answers.id) as answers_count
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN answers ON posts.id = answers.post_id
            GROUP BY posts.id, users.id
            ORDER BY posts.created_at DESC
        `);
        return res.status(200).json(posts.rows);
    } catch (error) {
        console.error("getPosts error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPost(req, res) {
    try {
        const { id } = req.params;
        const post = await db.query(`
            SELECT posts.*, users.name as author, COUNT(answers.id) as answers_count
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN answers ON posts.id = answers.post_id
            WHERE posts.id = $1
            GROUP BY posts.id, users.id
        `, [id]);
        return res.status(200).json(post.rows[0]);
    } catch (error) {
        console.error("getPost error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}