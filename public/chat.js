"use strict";

const CHAT_API_ENDPOINT = "/api/chat";

let dom = null;
let state = null;

function queryDom() {
    return {
        chatForm: document.querySelector(".chat-form"),
        chatInput: document.querySelector("#chat-input"),
        messages: document.querySelector(".messages"),
        personaButtons: Array.from(document.querySelectorAll(".persona-card")),
        personaModal: document.querySelector(".persona-modal"),
        personaModalOptions: Array.from(document.querySelectorAll(".persona-modal-option")),
        modalStartButton: document.querySelector(".modal-start-btn"),
        modalCancelButton: document.querySelector(".modal-cancel-btn"),
        modalBackdrop: document.querySelector(".persona-modal-backdrop"),
        title: document.querySelector(".chat-title-wrap h1"),
        subtitle: document.querySelector(".chat-title-wrap p"),
        newChatButton: document.querySelector(".new-chat-btn"),
    };
}

function isDomReady() {
    return Boolean(
        dom.chatForm &&
        dom.chatInput &&
        dom.messages &&
        dom.title &&
        dom.subtitle &&
        dom.personaButtons.length > 0
    );
}

function getPersonaFromButton(button) {
    const fallbackName = (button.querySelector(".persona-name")?.textContent || "Developer").trim();
    const fallbackDescription = "Ask coding questions, get explanations, and build faster.";

    return {
        name: button.dataset.persona || fallbackName,
        description: button.dataset.description || fallbackDescription,
    };
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function buildMessageElement({ role, text }) {
    const article = document.createElement("article");
    article.className = `message ${role === "user" ? "user" : "ai"}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "user" ? "You" : "AI";

    const content = document.createElement("div");
    content.className = "message-content";

    const paragraph = document.createElement("p");
    paragraph.innerHTML = escapeHtml(text).replaceAll("\n", "<br>");
    content.appendChild(paragraph);

    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = formatTimestamp(new Date().toISOString());
    content.appendChild(meta);

    if (role === "user") {
        article.append(content, avatar);
    } else {
        article.append(avatar, content);
    }

    return article;
}

function formatTimestamp(isoDateString) {
    const date = isoDateString ? new Date(isoDateString) : new Date();
    if (Number.isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollMessagesToBottom() {
    // Scroll the messages container to the bottom
    if (dom.messages.lastElementChild) {
        dom.messages.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

function addMessage(role, text, options = {}) {
    const messageText = String(text || "").trim();
    if (!messageText) return;

    const messageEl = buildMessageElement({ role, text: messageText });
    const meta = messageEl.querySelector(".message-meta");
    if (meta) {
        meta.textContent = formatTimestamp(options.timestamp);
    }
    dom.messages.appendChild(messageEl);
    scrollMessagesToBottom();
}

function showTypingIndicator() {
    if (state.typingIndicatorEl) return;

    const article = document.createElement("article");
    article.className = "message ai typing-indicator";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "AI";

    const content = document.createElement("div");
    content.className = "message-content";

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "typing-dots";
    dotsWrap.setAttribute("aria-label", "AI is typing");

    for (let i = 0; i < 3; i += 1) {
        const dot = document.createElement("span");
        dotsWrap.appendChild(dot);
    }

    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = "Typing...";

    content.append(dotsWrap, meta);
    article.append(avatar, content);

    dom.messages.appendChild(article);
    state.typingIndicatorEl = article;
    scrollMessagesToBottom();
}

function hideTypingIndicator() {
    if (!state.typingIndicatorEl) return;
    state.typingIndicatorEl.remove();
    state.typingIndicatorEl = null;
}

function clearMessages() {
    dom.messages.innerHTML = "";
}

function getPersonaWelcomeMessage(personaName) {
    const defaults = {
        Developer: "Hi! I am your Developer Persona. Tell me what you are building and I will help you break it down.",
        Mentor: "Hello! I am your Mentor Persona. Share your goal and I will guide your next learning steps.",
        Friend: "Hey! I am your Friend Persona. I am here for a relaxed and friendly chat.",
    };

    return defaults[personaName] || `Hello! I am your ${personaName} Persona. How can I help today?`;
}

function updatePersonaUI(persona) {
    state.activePersona = persona;
    dom.title.textContent = `${persona.name} Persona`;
    dom.subtitle.textContent = persona.description;
}

function setActivePersonaButton(nextButton) {
    dom.personaButtons.forEach((button) => {
        const isActive = button === nextButton;
        button.classList.toggle("active", isActive);
        if (isActive) {
            button.setAttribute("aria-current", "true");
        } else {
            button.removeAttribute("aria-current");
        }
    });
}

function setPending(isPending) {
    state.pending = Boolean(isPending);
    dom.chatInput.disabled = state.pending;

    const sendButton = dom.chatForm.querySelector(".send-btn");
    if (sendButton) {
        sendButton.disabled = state.pending;
        sendButton.textContent = state.pending ? "Sending..." : "Send";
    }
}

function startNewChat() {
    clearMessages();
    hideTypingIndicator();
    addMessage("ai", getPersonaWelcomeMessage(state.activePersona.name));
    dom.chatInput.focus();
}

function selectPersona(button) {
    const persona = getPersonaFromButton(button);
    setActivePersonaButton(button);
    updatePersonaUI(persona);
}

function handlePersonaClick(button) {
    selectPersona(button);
    startNewChat();
}

function requestPersonaForNewChat() {
    if (!dom.personaModal || dom.personaModalOptions.length === 0) return;

    state.pendingPersonaForNewChat = state.activePersona.name;
    updateModalPersonaSelection();
    dom.personaModal.classList.remove("hidden");
    dom.modalStartButton?.focus();
}

function closePersonaModal() {
    if (!dom.personaModal) return;

    dom.personaModal.classList.add("hidden");
    state.pendingPersonaForNewChat = null;
}

function updateModalPersonaSelection() {
    dom.personaModalOptions.forEach((option) => {
        const isSelected = option.dataset.personaOption === state.pendingPersonaForNewChat;
        option.classList.toggle("selected", isSelected);
        if (isSelected) {
            option.setAttribute("aria-current", "true");
        } else {
            option.removeAttribute("aria-current");
        }
    });
}

function choosePersonaInModal(personaName) {
    state.pendingPersonaForNewChat = personaName;
    updateModalPersonaSelection();
}

function confirmNewChatFromModal() {
    if (!state.pendingPersonaForNewChat) return;

    const matchingButton = dom.personaButtons.find(
        (button) => getPersonaFromButton(button).name === state.pendingPersonaForNewChat
    );
    if (!matchingButton) return;

    selectPersona(matchingButton);
    startNewChat();
    closePersonaModal();
}

function emitSendEvent(payload) {
    document.dispatchEvent(new CustomEvent("persona:message:send", { detail: payload }));
}

function emitReplyEvent(payload) {
    document.dispatchEvent(new CustomEvent("persona:message:reply", { detail: payload }));
}

async function sendMessageToBackend(payload) {
    const response = await fetch(CHAT_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    let data = {};
    try {
        data = await response.json();
    } catch (_error) {
        data = {};
    }

    if (!response.ok) {
        const errorMessage = data.error || data.message || "Unable to get a response from server.";
        throw new Error(errorMessage);
    }

    return data;
}

async function handleSubmit(event) {
    event.preventDefault();
    if (state.pending) return;

    const message = dom.chatInput.value.trim();
    if (!message) return;

    const payload = {
        message,
        persona: state.activePersona.name,
        timestamp: new Date().toISOString(),
    };

    addMessage("user", message, { timestamp: payload.timestamp });
    scrollMessagesToBottom();
    dom.chatInput.value = "";
    dom.chatInput.style.height = "auto";

    emitSendEvent(payload);
    if (typeof state.sendHandler === "function") {
        state.sendHandler(payload);
    }

    try {
        setPending(true);
        showTypingIndicator();
        const data = await sendMessageToBackend(payload);
        const replyText = String(data.reply || "").trim();
        hideTypingIndicator();

        if (replyText) {
            addMessage("ai", replyText, { timestamp: new Date().toISOString() });
            emitReplyEvent({ ...payload, reply: replyText });
        } else {
            addMessage("ai", "I received your message, but no reply text came from the server.");
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage("ai", `Server error: ${error.message}`);
    } finally {
        setPending(false);
        // Auto-focus the input for the next message
        requestAnimationFrame(() => {
            dom.chatInput.focus();
        });
    }
}

function autoResizeInput() {
    dom.chatInput.style.height = "auto";
    dom.chatInput.style.height = `${Math.min(dom.chatInput.scrollHeight, 140)}px`;
}

function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        dom.chatForm.requestSubmit();
    }
}

function handleEscapeClose(event) {
    if (event.key === "Escape" && dom.personaModal && !dom.personaModal.classList.contains("hidden")) {
        closePersonaModal();
    }
}

function bindEvents() {
    dom.personaButtons.forEach((button) => {
        button.addEventListener("click", () => handlePersonaClick(button));
    });

    dom.chatForm.addEventListener("submit", handleSubmit);
    dom.chatInput.addEventListener("input", autoResizeInput);
    dom.chatInput.addEventListener("keydown", handleInputKeyDown);

    dom.newChatButton?.addEventListener("click", requestPersonaForNewChat);
    dom.modalStartButton?.addEventListener("click", confirmNewChatFromModal);
    dom.modalCancelButton?.addEventListener("click", closePersonaModal);
    dom.modalBackdrop?.addEventListener("click", closePersonaModal);

    dom.personaModalOptions.forEach((option) => {
        option.addEventListener("click", () => choosePersonaInModal(option.dataset.personaOption || ""));
    });

    document.addEventListener("keydown", handleEscapeClose);
}

function exposePublicApi() {
    window.PersonaChatUI = {
        addUserMessage(text) {
            addMessage("user", text);
        },
        addAIMessage(text) {
            hideTypingIndicator();
            addMessage("ai", text);
            setPending(false);
        },
        clear() {
            startNewChat();
        },
        setPending(isPending) {
            setPending(isPending);
        },
        getActivePersona() {
            return state.activePersona.name;
        },
        onSend(callback) {
            state.sendHandler = typeof callback === "function" ? callback : null;
        },
    };
}

function initializePersonaChatUI() {
    dom = queryDom();
    if (!isDomReady()) return;

    state = {
        activePersona: getPersonaFromButton(
            dom.personaButtons.find((button) => button.classList.contains("active")) || dom.personaButtons[0]
        ),
        pendingPersonaForNewChat: null,
        typingIndicatorEl: null,
        sendHandler: null,
        pending: false,
    };

    updatePersonaUI(state.activePersona);
    clearMessages();
    addMessage("ai", getPersonaWelcomeMessage(state.activePersona.name));
    bindEvents();
    exposePublicApi();
    dom.chatInput.focus();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePersonaChatUI, { once: true });
} else {
    initializePersonaChatUI();
}
