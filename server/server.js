
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Notice model
const Notice = mongoose.model(
    "Notice",
    new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    }),
    "notices"
);

// Welcome page
app.get("/", (req, res) => {
    res.send("Welcome to Department Notice Board");
});

// Faculty page
app.get("/faculty", (req, res) => {
    res.send(`
        <h1>Faculty Members</h1>
        <p>Dr. Kumar</p>
        <p>Dr. Priya</p>
        <p>Prof. Ravi</p>
        <p>Prof. Meena</p>
    `);
});

// Get all notices
app.get("/api/notices", async (req, res) => {
    try {
        const notices = await Notice.find();
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch notices" });
    }
});

// Add a new notice
app.post("/api/notices", async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title?.trim() || !message?.trim()) {
            return res.status(400).json({
                error: "Title and message are required"
            });
        }

        const notice = await Notice.create({
            title: title.trim(),
            message: message.trim()
        });

        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ error: "Could not save notice" });
    }
});

// Connect MongoDB, then start Express
mongoose.connect("mongodb://127.0.0.1:27017/department_notice_board")
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(5000, () => {
            console.log("Server running at http://localhost:5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });