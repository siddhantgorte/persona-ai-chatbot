const express = require("express");
const { chat } = require("../controllers/chatController");
const {
    listChats,
    getChat,
    createNewChat,
    deleteChat,
    updateTitle,
} = require("../controllers/chatHistoryController");

const router = express.Router();

// Streaming endpoint
router.post("/", chat);

// Chat History CRUD endpoints
router.get("/history", listChats);
router.post("/history", createNewChat);
router.get("/history/:id", getChat);
router.delete("/history/:id", deleteChat);
router.patch("/history/:id", updateTitle);

module.exports = router;
