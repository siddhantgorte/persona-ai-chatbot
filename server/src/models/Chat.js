const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant", "ai"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        title: {
            type: String,
            default: "New Conversation",
            trim: true,
        },
        persona: {
            type: String,
            default: "developer",
            trim: true,
            lowercase: true,
        },
        messages: [messageSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);
