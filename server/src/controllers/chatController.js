const { streamChat } = require("../services/aiService");
const { appendMessagesToChat, createChat } = require("../services/chatHistoryService");
const { getUserId } = require("./chatHistoryController");

const chat = async (req, res) => {
    const { message, messages, persona, chatId } = req.body || {};
    const userId = getUserId(req);

    const safePersona = String(persona || "developer").trim();
    let conversationHistory = Array.isArray(messages) ? [...messages] : [];

    const userMessage = String(message || "").trim();
    if (userMessage) {
        conversationHistory.push({ role: "user", content: userMessage });
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
        onComplete: async (fullReply) => {
            if (chatId && userId) {
                await appendMessagesToChat(chatId, userId, userMessage, fullReply);
            }
        },
    });
};

module.exports = { chat };
