import { openConnection } from "../../db/openDbConnection.js"
import validator from "validator"
import bcrypt from "bcryptjs"

// TODO : use session stores like redis or mongoDB to persist data even
// after restarts  

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

        const user = await db.run('INSERT INTO users(name, email, password_hash, role) VALUES (?,?,?,?);', [name, email, password_hash, role]);

        await db.close()

        req.session.userId = user.lastID;

        console.log(req.session);

        res.status(201).json({message: "User registered successfully"});

    } catch (err) {
        res.status(500).json({message : "Internal server error", err:err});
    }
}

export async function loginController(req, res) {
    try {
        let {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({err: "All fields are required"});
        }

        const db = await openConnection();

        const user = await db.get("SELECT * FROM users WHERE email = ?;", [email]);

        await db.close();
        if (!user) {
            return res.status(404).json({err: "Account with this email is not found"})
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordValid) {
            return res.status(400).json({err: "Incorrect password"});
        }

        req.session.userId = user.id;

        return res.status(201).json({message: "Logged in"});

    } catch (err) {
        return res.status(500).json({err: `Internal server error, ${err}`});
    }
}

export function sessionController(req, res) {
    const userId = req.session.userId;
    res.json({ userId: userId ?? null });
}

export function logoutController(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ err: "Failed to log out" });
        }
        res.json({ message: "Logged out" });
    });
}