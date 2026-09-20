require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");
const Blog = require("./Blog");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET =
    process.env.JWT_SECRET || "myblog_secret_2026";


// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateToken(req, res, next) {

    const authHeader =
        req.headers["authorization"];

    const token =
        authHeader &&
        authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }

    jwt.verify(
        token,
        JWT_SECRET,
        (error, user) => {

            if (error) {

                return res.status(403).json({
                    message: "Invalid or expired token"
                });
            }

            req.user = user;

            next();
        }
    );
}


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(cors());

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "index.html"
        )
    );
});


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({
        message: "API is working!"
    });
});


// ==========================================
// REGISTER
// ==========================================

app.post(
    "/api/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;

            const existingUser =
                await User.findOne({
                    email: email
                });

            if (existingUser) {

                return res.status(400).json({
                    message:
                        "Email already registered"
                });
            }

            const user =
                new User({
                    name: name,
                    email: email,
                    password: password
                });

            await user.save();

            res.status(201).json({
                message:
                    "Registration successful"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Registration failed",
                error:
                    error.message
            });
        }
    }
);


// ==========================================
// LOGIN
// ==========================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            const user =
                await User.findOne({
                    email: email
                });

            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }

            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isPasswordCorrect) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }

            const token =
                jwt.sign(
                    {
                        userId:
                            user._id.toString(),

                        name:
                            user.name,

                        email:
                            user.email
                    },

                    JWT_SECRET,

                    {
                        expiresIn: "1d"
                    }
                );

            res.json({

                message:
                    "Login successful",

                token:
                    token,

                user: {
                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email
                }

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Login failed",
                error:
                    error.message
            });
        }
    }
);


// ==========================================
// CREATE BLOG
// ==========================================

app.post(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                category,
                content
            } = req.body;

            const blog =
                new Blog({

                    title:
                        title,

                    category:
                        category,

                    content:
                        content,

                    // Always use the
                    // logged-in user's name
                    author:
                        req.user.name
                });

            await blog.save();

            res.status(201).json({

                message:
                    "Blog created successfully",

                blog:
                    blog

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Blog creation failed",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// GET ALL BLOGS
// PUBLIC - USED BY HOME PAGE
// ==========================================

app.get(
    "/api/blogs",
    async (req, res) => {

        try {

            const blogs =
                await Blog.find()
                    .sort({
                        createdAt: -1
                    });

            res.json(blogs);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Unable to fetch blogs",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// GET LOGGED-IN USER'S BLOGS
// ==========================================

app.get(
    "/api/my-blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const blogs =
                await Blog.find({
                    author:
                        req.user.name
                })
                .sort({
                    createdAt: -1
                });

            res.json(blogs);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Unable to fetch your blogs",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// GET SINGLE BLOG
// PUBLIC
// ==========================================

app.get(
    "/api/blogs/:id",
    async (req, res) => {

        try {

            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {

                return res.status(404).json({
                    message:
                        "Blog not found"
                });
            }

            res.json(blog);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Unable to fetch blog",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// UPDATE BLOG
// ONLY OWNER CAN UPDATE
// ==========================================

app.put(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                category,
                content
            } = req.body;

            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {

                return res.status(404).json({
                    message:
                        "Blog not found"
                });
            }

            // Check ownership
            if (
                blog.author !==
                req.user.name
            ) {

                return res.status(403).json({
                    message:
                        "You can only edit your own blog"
                });
            }

            blog.title =
                title;

            blog.category =
                category;

            blog.content =
                content;

            await blog.save();

            res.json({

                message:
                    "Blog updated successfully",

                blog:
                    blog
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Blog update failed",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// DELETE BLOG
// ONLY OWNER CAN DELETE
// ==========================================

app.delete(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {

                return res.status(404).json({
                    message:
                        "Blog not found"
                });
            }

            // Check ownership
            if (
                blog.author !==
                req.user.name
            ) {

                return res.status(403).json({
                    message:
                        "You can only delete your own blog"
                });
            }

            await Blog.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Blog deleted successfully"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Blog deletion failed",

                error:
                    error.message
            });
        }
    }
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "Mongodb connected successfully"
        );

    })

    .catch((err) => {

        console.log(
            "Mongodb connection error:",
            err
        );

    });


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);