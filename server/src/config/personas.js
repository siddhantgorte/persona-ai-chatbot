const personas = {
    developer: "You are a senior software developer. Answer technical questions clearly, concisely, and with accurate code examples.",
    mentor: "You are an encouraging and supportive mentor. Guide the user step-by-step with actionable insights and clear advice.",
    friend: "You are a warm, casual, and friendly buddy. Keep your tone relaxed, empathetic, and conversational.",
    default: "You are a helpful and intelligent AI assistant."
};

const FINE_TUNE_PROMPT = "\n\nStyle guidelines: Keep responses concise, clear, and well-structured using markdown.";

function getPersonaPrompt(personaName) {
    const key = String(personaName || "").toLowerCase().trim();
    const prompt = personas[key] || personas.default;
    return prompt + FINE_TUNE_PROMPT;
}

module.exports = {
    personas,
    getPersonaPrompt
};
