import { db } from "../../db/openDbConnection.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function registerController(req, res) {
    try {
        let { name, email, password, role, code } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }

        name = name.trim();
        email = email.trim();

        if (!/^[a-zA-Z0-9_-]{1,20}$/.test(name)) {
            return res.status(400).json({ err: "Username must be 1–20 characters, using letters, numbers, _ or -" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ err: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ err: "Password must contain at least 8 characters" })
        }

        const zbResponse = await fetch(`https://api.zerobounce.net/v2/validate?email=${email}&api_key=${process.env.ZEROBOUNCE_API_KEY}`);
        if (zbResponse.ok) {
            const data = await zbResponse.json();
            if (data.status != "valid") {
                return res.status(400).json({ err: "This email address does not exist" });
            }
        }

        const exists = await db.query("SELECT id FROM users WHERE email = $1;", [email]);

        if (exists.rows.length > 0) {
            return res.status(400).json({ err: "An account with this email already exists" });
        }

        if (role === "instructor") {
            if (code !== process.env.INSTRUCTOR_CODE) {
                return res.status(400).json({ err: "Incorrect instructor code" });
            }
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await db.query('INSERT INTO users(name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id;', [name, email, password_hash, role]);

        const token = jwt.sign(
            { id: user.rows[0].id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("registerController error:", err);
        res.status(500).json({ message: "Internal server error", err: err.message });
    }
}

export async function loginController(req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ err: "Account with this email is not found" })
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordValid) {
            return res.status(400).json({ err: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user.id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({ message: "Logged in" });

    } catch (err) {
        return res.status(500).json({ err: `Internal server error, ${err}` });
    }
}

export async function sessionController(req, res) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ session: null });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userQuery = await db.query("SELECT name FROM users WHERE id = $1", [decoded.id]);
        const name = userQuery.rows[0]?.name || "User";
        
        return res.status(200).json({
            session: {
                userId: decoded.id,
                email: decoded.email,
                name: name
            }
        });
    } catch (err) {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        return res.json({ session: null });
    }
}

export function logoutController(req, res) {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.json({ message: "Logged out" });
}