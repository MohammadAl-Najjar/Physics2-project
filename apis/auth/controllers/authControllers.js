import { openConnection } from "./../../../db/openDbConnection.js"
import validator from "validator"
import bcrypt from "bcryptjs"

export async function registerController(req, res) {
    try {
        let {name, email, password, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({err: "All fields are required"});
        }

        name = name.trim();
        email = email.trim();

        if (!/^[a-zA-Z0-9_-]{1,20}$/.test(name)) {
            return res.status(400).json({err: "Username must be 1–20 characters, using letters, numbers, _ or -"});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({err: "Invalid email format"});
        }

        if (password.length < 8) {
            return res.status(400).json({err: "Password must contain at least 8 characters"})
        }

        const response = await fetch (`https://api.zerobounce.net/v2/validate?email=${email}&api_key=${process.env.ZEROBOUNCE_API_KEY}`);
        const data = await response.json()
        if (data.status != "valid") {
            return res.status(400).json({err: "This email address does not exist"})
        }

        const db = await openConnection();

        const exists = await db.get("SELECT id FROM users WHERE email = ?;", [email]);

        if (exists) {
            return res.status(400).json({err: "An account with this email already exists"});
        }

        const password_hash = await bcrypt.hash(password, 10);

        await db.run('INSERT INTO users(name, email, password_hash, role) VALUES (?,?,?,?);', [name, email, password_hash, role]);

        await db.close()

        res.status(201).json({message: "User registered successfully"});

    } catch (err) {
        res.status(500).json({message : "Internal server error", err:err});
    }
}

export async function loginController() {
    
}