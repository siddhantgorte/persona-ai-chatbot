const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "") || "";
const API_URL = `${configuredBaseUrl}/api/chat`;

export async function streamChatResponse(
    message,
    persona,
    onChunk,
    history = []
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55_000);

    let response;
    try {
        response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, persona, messages: history }),
            signal: controller.signal,
        });
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("The request timed out. Please try again.");
        }
        throw new Error("Unable to reach the server. Check your connection and try again.");
    }

    if (!response.ok) {
        clearTimeout(timeoutId);
        let message = "Failed to get a response from the server.";
        try {
            const body = await response.json();
            if (body.error) message = body.error;
        } catch {
            // Keep the fallback message for non-JSON responses.
        }
        throw new Error(message);
    }

    if (!response.body) {
        throw new Error("The server returned an empty response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const event of events) {
                const line = event.split("\n").find((item) => item.startsWith("data: "));
                if (!line) continue;

                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) throw new Error(parsed.error);
                    if (parsed.delta) onChunk(parsed.delta);
                } catch (error) {
                    if (error instanceof SyntaxError) continue;
                    throw error;
                }
            }
        }
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("The response timed out. Please try again.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}