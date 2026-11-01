const OpenAI = require("openai");
const { getPersonaPrompt } = require("../config/personas");

const configuredModel = String(process.env.AI_MODEL || "").trim();
const isGeminiModel = configuredModel.toLowerCase().startsWith("gemini") || configuredModel.length === 0;
const MODEL_NAME = isGeminiModel ? "gemini-3-flash-preview" : configuredModel;

const openAIClient = isGeminiModel
    ? null
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 45_000, maxRetries: 1 });

async function streamChat({ persona, messages, res, onComplete }) {
    const systemPrompt = getPersonaPrompt(persona);
    const cleanMessages = (Array.isArray(messages) ? messages : [])
        .filter((message) => message && message.role !== "typing")
        .map((message) => ({
            role: message.role === "ai" || message.role === "assistant" || message.role === "model" ? "assistant" : "user",
            content: String(message.content || message.text || "").trim(),
        }))
        .filter((message) => message.content.length > 0)
        .slice(-12);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const apiKey = isGeminiModel ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
    if (!apiKey) {
        res.status(503);
        res.write(`data: ${JSON.stringify({ error: "AI provider is not configured on the server." })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
        return;
    }

    res.flushHeaders();
    let fullReply = "";

    try {
        if (isGeminiModel) {
            const contents = cleanMessages.map((message) => ({
                role: message.role === "assistant" ? "model" : "user",
                parts: [{ text: message.content }],
            }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45_000);

            let response;
            try {
                for (let attempt = 0; attempt < 3; attempt++) {
                    response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL_NAME)}:generateContent?key=${encodeURIComponent(apiKey)}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                contents,
                            }),
                            signal: controller.signal,
                        }
                    );

                    if (response.ok) break;

                    const status = response.status;
                    if ((status === 429 || status >= 500) && attempt < 2) {
                        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
                        continue;
                    }
                    if (status === 429) throw Object.assign(new Error("AI provider rate limit"), { status: 429 });
                    if (status === 401 || status === 403) throw Object.assign(new Error("AI credentials rejected"), { status });
                    throw Object.assign(new Error(`AI provider returned ${status}`), { status });
                }

                const payload = await response.json();
                const reply = payload.candidates?.[0]?.content?.parts
                    ?.map((part) => part.text || "")
                    .join("") || "";

                if (!reply) {
                    throw Object.assign(new Error("AI provider returned an empty response"), { status: 502 });
                }

                fullReply = reply;
                for (let index = 0; index < reply.length; index += 40) {
                    res.write(`data: ${JSON.stringify({ delta: reply.slice(index, index + 40) })}\n\n`);
                }
            } finally {
                clearTimeout(timeoutId);
            }
        } else {
            const stream = await openAIClient.chat.completions.create({
                model: MODEL_NAME,
                messages: [{ role: "system", content: systemPrompt }, ...cleanMessages.map((message) => ({ role: message.role, content: message.content }))],
                stream: true,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content || "";
                if (delta) {
                    fullReply += delta;
                    res.write(`data: ${JSON.stringify({ delta })}\n\n`);
                }
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
        console.error("AI Streaming Error:", {
            name: error?.name,
            status: error?.status,
            message: error?.message,
        });

        let message = "Failed to generate AI response. Please try again.";
        if (error?.status === 429) {
            message = "The AI provider is busy or has reached its quota. Please wait and try again.";
        } else if (error?.status >= 500) {
            message = "The AI provider is temporarily unavailable. Please try again.";
        } else if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
            message = "The configured AI model or credentials are invalid.";
        } else if (error?.name === "AbortError" || error?.message?.includes("timed out")) {
            message = "The AI provider took too long to respond. Please try again.";
        }

        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
        }
    }
}

module.exports = { streamChat };
