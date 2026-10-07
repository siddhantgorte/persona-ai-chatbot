const Chat = require("../models/Chat");

/**
 * List all chat sessions for a user (lightweight, excludes message body)
 */
async function getUserChats(userId) {
    if (!userId) return [];
    return await Chat.find({ userId })
        .select("_id title persona updatedAt createdAt")
        .sort({ updatedAt: -1 });
}

/**
 * Fetch a specific chat session with full message history
 */
async function getChatById(chatId, userId) {
    return await Chat.findOne({ _id: chatId, userId });
}

/**
 * Create a new chat session
 */
async function createChat({ userId, persona, title }) {
    const defaultTitle = title || `New ${persona ? persona.charAt(0).toUpperCase() + persona.slice(1) : "AI"} Chat`;
    return await Chat.create({
        userId,
        persona: persona || "developer",
        title: defaultTitle,
        messages: [],
    });
}

/**
 * Append user message and AI reply to an existing chat session
 */
async function appendMessagesToChat(chatId, userId, userMessage, assistantReply) {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return null;

    chat.messages.push({ role: "user", content: userMessage });
    chat.messages.push({ role: "assistant", content: assistantReply });

    // Auto-update title if it's still the default title
    if (chat.title.startsWith("New ") && userMessage) {
        const generatedTitle = userMessage.slice(0, 30).trim() + (userMessage.length > 30 ? "..." : "");
        chat.title = generatedTitle;
    }

    await chat.save();
    return chat;
}

/**
 * Delete a chat session
 */
async function deleteChat(chatId, userId) {
    return await Chat.findOneAndDelete({ _id: chatId, userId });
}

/**
 * Rename a chat session title
 */
async function updateChatTitle(chatId, userId, title) {
    return await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        { title: title.trim() },
        { new: true }
    );
}

module.exports = {
    getUserChats,
    getChatById,
    createChat,
    appendMessagesToChat,
    deleteChat,
    updateChatTitle,
};
