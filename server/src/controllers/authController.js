const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(user) {
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not configured");
    }
    
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if( typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if(!normalizedName || normalizedName.length > 100){
            return res.status(400).json({
                success: false,
                message: "Name must be between 1 and 100 characters",
            });
        }

        if ( normalizedEmail.length > 255 || !EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 72 characters",
            });
        }

        const existingUser = await db("users").where({ email: normalizedEmail }).first("id");

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const [user] = await db("users").insert({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
        }).returning(["id", "name", "email"]);

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user,
        });
    } catch (error) {
        // PostgreSQL unique constraint violation.
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to register user",
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if ( typeof email !== "string" || typeof password !== "string" || !email.trim() || !password ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await db("users").where({ email: normalizedEmail }).first();

        // Use the same response for unknown emails and wrong passwords.
        if ( !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in",
        });
    }
};