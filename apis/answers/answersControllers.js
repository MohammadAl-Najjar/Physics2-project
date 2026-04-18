import { db } from "../../db/openDbConnection.js"

export async function createAnswer(req, res) {
    try {
        const { body } = req.body;
        const postId = req.params.postId;

        if (!postId || !body) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const user_id = req.userId;

        await db.query("INSERT INTO answers (body, user_id, post_id) VALUES ($1, $2, $3)", [body, user_id, postId]);

        return res.status(201).json({ message: "Answer created successfully" })
    } catch (error) {
        return res.status(500).json({ err: "Internal server error, " + error.message });
    }
}

export async function getAnswersForPost(req, res) {
    try {
        const postId = req.params.postId;

        if (!postId) {
            return res.status(400).json({ err: "Post ID is required" });
        }

        const answers = await db.query(`
            SELECT answers.*, users.name as author 
            FROM answers 
            JOIN users ON answers.user_id = users.id 
            WHERE answers.post_id = $1
            ORDER BY answers.created_at DESC
        `, [postId]);

        return res.status(200).json({ answers: answers.rows });
    } catch (error) {
        return res.status(500).json({ err: "Internal server error, " + error.message });
    }
}
