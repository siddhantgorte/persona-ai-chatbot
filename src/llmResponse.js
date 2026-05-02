const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ============================
// PERSONA SYSTEM PROMPTS
// ============================

const personas = {
    default: "You are a helpful AI assistant.",
    developer: "You are a senior software developer. Answer technically and clearly.",
    mentor: "You are a supportive mentor. Guide step-by-step.",
    friend: "You are a casual friendly buddy. Keep tone relaxed and fun."
};

const fineTunePrompt = "Keep responses short, clear, and under 3-4 sentences. Avoid long explanations."

// ============================
// Conversation Memory
// ============================

let conversation = [];
let currentPersona = "default";

// ============================
// Limit memory size
// ============================

function limitMemory() {
    const MAX_MESSAGES = 12; // adjust if needed

    if (conversation.length > MAX_MESSAGES) {
        conversation = [
            conversation[0], // keep system prompt
            ...conversation.slice(-MAX_MESSAGES)
        ];
    }
}

// ============================
// Set Persona
// ============================

function setPersona(persona) {
    const normalized = persona.toLowerCase(); // ✅ FIX
    currentPersona = normalized in personas ? normalized : "default";

    conversation = [
        {
            role: "system",
            content: personas[currentPersona] + fineTunePrompt
        }
    ];
}

// ============================
// Reset Conversation
// ============================

function resetConversation() {
    conversation = [
        {
            role: "system",
            content: personas[currentPersona] + fineTunePrompt
        }
    ];
}

// ============================
// Get Streaming Response
// ============================

async function getStreamingResponse(userMessage, res) {
    try {
        if (conversation.length === 0) {
            setPersona(currentPersona);
        }

        conversation.push({ role: "user", content: userMessage });
        limitMemory();

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversation,
        });

        const reply = completion.choices[0].message.content;

        conversation.push({ role: "assistant", content: reply });

        res.json({ reply }); // ✅ FIX
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error generating response" });
    }
}

module.exports = {
    getStreamingResponse,
    setPersona,
    resetConversation
};
