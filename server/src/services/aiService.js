const OpenAI = require("openai");
const { getPersonaPrompt } = require("../config/personas");

const MODEL_NAME = process.env.AI_MODEL || "gemini-1.5-flash";
const isGeminiModel = MODEL_NAME.toLowerCase().startsWith("gemini");

const client = isGeminiModel
    ? new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      })
    : new OpenAI();

/**
 * Streams AI completion back over Server-Sent Events (SSE).
 */
async function streamChat({ persona, messages, res, onComplete }) {
    const systemPrompt = getPersonaPrompt(persona);

    // Filter out invalid/empty messages and typing indicators
    const cleanMessages = (Array.isArray(messages) ? messages : [])
        .filter((m) => m && m.role !== "typing")
        .map((m) => ({
            role: m.role === "ai" || m.role === "assistant" ? "assistant" : "user",
            content: String(m.content || m.text || "").trim(),
        }))
        .filter((m) => m.content.length > 0);

    const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...cleanMessages,
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

        let fullReply = "";

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
                fullReply += delta;
                res.write(`data: ${JSON.stringify({ delta })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();

        if (typeof onComplete === "function") {
            try {
                await onComplete(fullReply);
            } catch (saveErr) {
                console.error("Failed to persist conversation history:", saveErr);
            }
        }
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
