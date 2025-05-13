// blog_backend_server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(uploadDir));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    dest: 'uploads/', // Path where the images will be stored
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size (10MB)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

// User registration without bcrypt (storing plain text password)
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password], // storing password as plain text
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully", id: result.insertId });
        }
    );
});


// Login without bcrypt (comparing plain text passwords)
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

        const user = results[0];
        // Direct password comparison
        if (user.password === password) {
            if (email === "admin@gmail.com") {
                res.json({ message: "Admin logged in successfully", admin: user });
            } else {
                res.json({ message: "User logged in successfully", user });
            }
        } else {
            res.json({ message: "Invalid email or password" });
        }
    });
});


// Get all users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Create blog with image
app.post("/blog", upload.single("image"), (req, res) => {
    const { title, content, catagorie, author, email } = req.body;
    const image = req.file ? req.file.filename : null;

    const sql = "INSERT INTO blogs (title, content, catagorie, author, email, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, content, catagorie, author, email, image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Blog created successfully", id: result.insertId });
    });
});

// Get all blogs
app.get("/blogs", (req, res) => {
    db.query("SELECT * FROM blogs", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Get blog by title
app.get("/blogs/:title", (req, res) => {
    const title = req.params.title;
    db.query("SELECT * FROM blogs WHERE title = ?", [title], (err, result) => {
        if (err) return res.status(404).send(err);
        res.json(result);
    });
});

// Get blogs by category
app.get("/blogs/catagorie/:category", (req, res) => {
    const category = req.params.category;
    db.query("SELECT * FROM blogs WHERE catagorie = ?", [category], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Get user blogs
app.get("/user-blogs/:email", (req, res) => {
    const { email } = req.params;
    db.query("SELECT * FROM blogs WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.put('/blog/:id', upload.single("image"), (req, res) => {
    console.log('Request Body:', req.body); // Logs form fields
    console.log('Uploaded File:', req.file); // Logs uploaded image

    const { id } = req.params;
    const { title, content, catagorie, author } = req.body;
    const image = req.file ? req.file.filename : null;

    const sql = `
        UPDATE blogs 
        SET title = ?, content = ?, author = ?, catagorie = ?, image = ?
        WHERE id = ?`;

    db.query(sql, [title, content, author, catagorie, image, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        res.json({ message: "Blog details updated" });
    });
});


// Update blog by ID
// app.put("/blogs/:id", (req, res) => {
//     const { id } = req.params;
//     const { title, content, author, category } = req.body;
//     db.query("UPDATE blogs SET title = ?, content = ?, author = ?, category = ? WHERE id = ?",
//         [title, content, author, category, id],
//         (err, result) => {
//             if (err) return res.status(500).json({ error: "Update failed" });
//             res.json({ message: "Blog details updated" });
//         });
// });

// Delete blog by ID
app.delete("/blogs/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM blogs WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Deletion failed" });
        res.json({ message: "The blog has been deleted successfully" });
    });
});

app.listen(5000, () => console.log("The server is running on port 5000"));
