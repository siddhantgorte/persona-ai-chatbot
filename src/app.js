const express = require("express");
const path = require("path");

const chatRoutes = require("./routes/chatRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

const publicPath = path.join(__dirname, "..", "public");    

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Health Check
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Persona AI server is running" });
});

//  Chat Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

//  Serve static file
app.use(express.static(publicPath));

module.exports = app;
