require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./User");
const Blog = require("./Blog");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "..")));


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});


// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working!"
    });
});


// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const user = new User({
            name: name,
            email: email,
            password: password
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ===============================
// CREATE BLOG
// ===============================

app.post("/api/blogs", async (req, res) => {
    try {

        const { title, category, content, author } = req.body;

        const blog = new Blog({
            title: title,
            category: category,
            content: content,
            author: author
        });

        await blog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog: blog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Blog creation failed",
            error: error.message
        });
    }
});


// ===============================
// GET ALL BLOGS
// ===============================

app.get("/api/blogs", async (req, res) => {
    try {

        const blogs = await Blog.find().sort({
            createdAt: -1
        });

        res.json(blogs);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch blogs",
            error: error.message
        });
    }
});


// ===============================
// UPDATE BLOG
// ===============================

app.put("/api/blogs/:id", async (req, res) => {
    try {

        const { title, category, content } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: title,
                category: category,
                content: content
            },
            {
                new: true
            }
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog: blog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Blog update failed",
            error: error.message
        });
    }
});


// ===============================
// DELETE BLOG
// ===============================

app.delete("/api/blogs/:id", async (req, res) => {
    try {

        const blog = await Blog.findByIdAndDelete(
            req.params.id
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Blog deletion failed",
            error: error.message
        });
    }
});


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        console.log("MongoDB connected successfully");
    })

    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});