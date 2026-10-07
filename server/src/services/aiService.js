const OpenAI = require("openai");
const { getPersonaPrompt } = require("../config/personas");

// Determine model name from .env (defaults to Gemini)
const MODEL_NAME = process.env.AI_MODEL || "gemini-2.5-flash";
const isGeminiModel = MODEL_NAME.toLowerCase().startsWith("gemini");

// Configure OpenAI SDK based on model
const client = isGeminiModel
    ? new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      })
    : new OpenAI(); // Default OpenAI: auto-picks OPENAI_API_KEY and api.openai.com

/**
 * Streams AI completion back over Server-Sent Events (SSE).
 * Stateless: uses message history passed in from the client request.
 */
async function streamChat({ persona, messages, res }) {
    const systemPrompt = getPersonaPrompt(persona);

    // Format messages: System prompt + conversation history
    const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
            role: m.role === "ai" || m.role === "assistant" ? "assistant" : "user",
            content: m.text || m.content || "",
        })),
    ];

    // Keep memory bounded to the last 12 messages
    const limitedMessages = [
        formattedMessages[0],
        ...formattedMessages.slice(-12),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const stream = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: limitedMessages,
            stream: true,
        });

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
                res.write(`data: ${JSON.stringify({ delta })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("AI Streaming Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate AI response." });
        } else {
            res.write(`data: ${JSON.stringify({ error: "Stream error occurred." })}\n\n`);
            res.end();
        }
    }
}

module.exports = { streamChat };
