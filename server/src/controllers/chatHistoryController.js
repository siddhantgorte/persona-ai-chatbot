const chatHistoryService = require("../services/chatHistoryService");

// Helper to extract Clerk userId safely from req
function getUserId(req) {
    if (req.auth && typeof req.auth.userId === "string") return req.auth.userId;
    if (typeof req.auth === "function") {
        const authData = req.auth();
        if (authData && authData.userId) return authData.userId;
    }
    // Fallback header for testing or unauthenticated dev sessions
    return req.headers["x-user-id"] || "guest_user";
}

// GET /api/chat/history
const listChats = async (req, res) => {
    try {
        const userId = getUserId(req);
        const chats = await chatHistoryService.getUserChats(userId);
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history." });
    }
};

// GET /api/chat/history/:id
const getChat = async (req, res) => {
    try {
        const userId = getUserId(req);
        const chat = await chatHistoryService.getChatById(req.params.id, userId);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        res.status(200).json({ chat });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat." });
    }
};

// POST /api/chat/history
const createNewChat = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { persona, title } = req.body || {};

        const chat = await chatHistoryService.createChat({
            userId,
            persona,
            title,
        });

        res.status(201).json({ chat });
    } catch (error) {
        res.status(500).json({ error: "Failed to create new chat." });
    }
};

// DELETE /api/chat/history/:id
const deleteChat = async (req, res) => {
    try {
        const userId = getUserId(req);
        const result = await chatHistoryService.deleteChat(req.params.id, userId);

        if (!result) {
            return res.status(404).json({ error: "Chat not found." });
        }

        res.status(200).json({ ok: true, message: "Chat deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete chat." });
    }
};

// PATCH /api/chat/history/:id
const updateTitle = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { title } = req.body || {};

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required." });
        }

        const chat = await chatHistoryService.updateChatTitle(
            req.params.id,
            userId,
            title
        );

        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        res.status(200).json({ chat });
    } catch (error) {
        res.status(500).json({ error: "Failed to update chat title." });
    }
};

module.exports = {
    listChats,
    getChat,
    createNewChat,
    deleteChat,
    updateTitle,
    getUserId,
};
