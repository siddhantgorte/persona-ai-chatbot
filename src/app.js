const express = require("express");
const path = require("path");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

const publicPath = path.join(__dirname, "..", "public");    

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

//  Health Check
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Persona AI server is running" });
});

//  Chat Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

//  Expose Clerk publishable key to the frontend
app.get("/api/config", (_req, res) => {
    res.json({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });
});

//  Serve static file
app.use(express.static(publicPath));

module.exports = app;
