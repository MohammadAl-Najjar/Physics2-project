import { db } from "../../db/openDbConnection.js"
import { transporter } from "../lib/transporter.js";

export async function createAnswer(req, res) {
    try {
        const { body } = req.body;
        const postId = req.params.postId;

        if (!postId || !body) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const user_id = req.userId;

        await db.query("INSERT INTO answers (body, user_id, post_id) VALUES ($1, $2, $3)", [body, user_id, postId]);

        const users = await db.query(`
            SELECT users.email 
            FROM users 
            JOIN answers ON users.id = answers.user_id 
            WHERE answers.post_id = $1 AND users.id != $2
            UNION
            SELECT users.email 
            FROM users 
            JOIN posts ON users.id = posts.user_id 
            WHERE posts.id = $1 AND users.id != $2
        `, [postId, user_id]);

        const sender = await db.query("SELECT name FROM users WHERE id = $1", [user_id]);
        const senderName = sender.rows[0]?.name || "Someone";

        users.rows.forEach(async (user) => {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "New reply on a post you participated in",
                    text: `A new reply has been added by ${senderName}:\n\n${body}`,
                });
            } catch (err) {
                console.error("Failed to send email:", err);
            }
        });

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

export async function getMyAnswers(req, res) {
    try {
        const user_id = req.userId;
        const answers = await db.query(`
            SELECT answers.*, users.name as author 
            FROM answers 
            JOIN users ON answers.user_id = users.id 
            WHERE answers.user_id = $1
            ORDER BY answers.created_at DESC
        `, [user_id]);
        return res.status(200).json({ answers: answers.rows });
    } catch (error) {
        return res.status(500).json({ err: "Internal server error, " + error.message });
    }
}
