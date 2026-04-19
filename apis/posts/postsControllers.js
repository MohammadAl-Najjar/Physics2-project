import { db } from "../../db/openDbConnection.js";
import { supabase } from "../lib/supabaseClient.js";
import { transporter } from "../lib/transporter.js";

export async function createPost(req, res) {
    try {
        const { title, body, category } = req.body;
        let image_url = null;

        if (req.file) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `image-${uniqueSuffix}-${sanitizedOriginalName}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filename, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (uploadError) {
                console.error("Supabase upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }

            const { data: publicUrlData } = supabase.storage
                .from('uploads')
                .getPublicUrl(filename);

            image_url = publicUrlData.publicUrl;
        }

        const user_id = req.userId;

        if (!title || !body || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await db.query(`
            INSERT INTO posts (title, body, category, image_url, user_id) VALUES ($1, $2, $3, $4, $5)
        `, [title, body, category, image_url, user_id]);

        const users = await db.query("SELECT email FROM users");

        const sender = await db.query("SELECT * FROM users WHERE id = $1", [user_id]);

        users.rows.forEach(async (user) => {
            if (user.email !== sender.rows[0].email) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: title,
                    text: `A new post has been created by ${sender.rows[0].name}:\n\n${body}`,
                });
            }
        });

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

export async function getMyPosts(req, res) {
    try {
        const user_id = req.userId;
        const posts = await db.query(`
            SELECT posts.*, users.name as author, COUNT(answers.id) as answers_count
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN answers ON posts.id = answers.post_id
            WHERE posts.user_id = $1
            GROUP BY posts.id, users.id
            ORDER BY posts.created_at DESC
        `, [user_id]);
        return res.status(200).json(posts.rows);
    } catch (error) {
        console.error("getMyPosts error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}