const express = require("express");
const path = require("path");
const { getStreamingResponse, setPersona } = require("./llmResponse");

const app = express();
const publicPath = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Persona AI server is running" });
});

app.post("/api/chat", (req, res) => {
    const { message, persona, timestamp } = req.body || {};
    const safeMessage = String(message || "").trim();
    const safePersona = String(persona || "").trim();

    if (!safeMessage) {
        return res.status(400).json({ error: "Message is required." });
    }

    if (!safePersona) {
        return res.status(400).json({ error: "Persona is required." });
    }

    // Set the persona and get streaming response from LLM
    setPersona(safePersona);
    getStreamingResponse(safeMessage, res);
});

app.use(express.static(publicPath));

module.exports = app;
