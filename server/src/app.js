require("dotenv").config();
const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
    "http://localhost:5173",
    "https://persona-ai-chatbot-puce.vercel.app",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            const isLocal = !origin || origin === "http://localhost:5173";
            const isConfigured = origin && allowedOrigins.includes(origin);
            const isVercel = origin && /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin);

            if (isLocal || isConfigured || isVercel) {
                return callback(null, true);
            }

            return callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Health Check
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Persona AI server is running" });
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
