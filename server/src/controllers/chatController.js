const { streamChat } = require("../services/aiService");

const chat = async (req, res) => {
    const { message, messages, persona } = req.body || {};

    const safePersona = String(persona || "developer").trim();
    let conversationHistory = Array.isArray(messages) ? [...messages] : [];

    if (message && typeof message === "string" && message.trim()) {
        conversationHistory.push({ role: "user", text: message.trim() });
    }

    if (conversationHistory.length === 0) {
        return res.status(400).json({
            error: "Message or messages history is required.",
        });
    }

    return streamChat({
        persona: safePersona,
        messages: conversationHistory,
        res,
    });
};

module.exports = { chat };
