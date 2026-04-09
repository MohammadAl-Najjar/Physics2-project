import { openConnection } from "../../db/openDbConnection.js"

export async function createAnswer(req, res) {
    try {
        const { body } = req.body;
        const postId = req.params.postId;

        if (!postId || !body) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const db = await openConnection();

        const user_id = req.userId;

        await db.run("INSERT INTO answers (body, user_id, post_id) VALUES (?,?,?)", [body, user_id, postId]);

        await db.close();

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

        const db = await openConnection();

        const answers = await db.all(`
            SELECT answers.*, users.name as author 
            FROM answers 
            JOIN users ON answers.user_id = users.id 
            WHERE answers.post_id = ?
            ORDER BY answers.created_at DESC
        `, [postId]);

        await db.close();

        return res.status(200).json({ answers });
    } catch (error) {
        return res.status(500).json({ err: "Internal server error, " + error.message });
    }
}
