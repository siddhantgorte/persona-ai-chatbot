let secretKey = "";
let _model = ""
let URL = ""    //holds gemini openai compatible url link if gemni model is selected

// Open modal when OpenAI is selected
document.getElementById('model-openai').addEventListener('change', () => {
    document.getElementById('openaiModal').classList.remove('hidden');
    document.getElementById('openaiModal').classList.add('flex');
});

// Cancel button closes modal and unchecks OpenAI
document.getElementById('cancelKey').addEventListener('click', () => {
    document.getElementById('model-openai').checked = false;
    document.getElementById('openaiModal').classList.add('hidden');
});

// Save button stores openai key and closes modal
document.getElementById('saveKey').addEventListener('click', () => {
    const key = document.getElementById('openaiKey').value.trim();
    if (key) {
        secretKey = key;
        _model = 'gpt-4.1-mini';
        // if OpenAI is selected, secretKey should already be set by save button and no need of url because it will call default one
        document.getElementById('openaiModal').classList.add('hidden');
    } else {
        alert("Please enter your API key.");
    }
});

// Start Chat button
document.getElementById('startChatBtn').addEventListener("click", () => {
    const persona = document.querySelector('input[name="persona"]:checked');
    const model = document.querySelector('input[name="model"]:checked');

    if (!persona) {
        alert("Please select a persona");
        return;
    } else if (!model) {
        alert("Please select a model");
        return;
    }
    // Gemini selection
    if (model.id === "model-gemini") {
        secretKey = "AIzaSyCFTcIjvK96aaYUz4lTJS6rHnH9HJZXxZk";
        URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
        _model = "gemini-2.0-flash";
    }


    console.log("Selected Persona:", persona.value);
    console.log("Selected Model:", _model);
    console.log("Selected secretKey:", secretKey);
    console.log("Selected URL:", URL);

    startChat(persona.value, _model, secretKey, URL);

});

function startChat(persona, model, apiKey, baseURL) {
    const selection = document.getElementById("selectionContainer");
    if (selection) {
        selection.classList.add("hidden");  //  hide the select persona and model UI
    }

    const chat = document.getElementById("chatContainer");
    chat.classList.remove("hidden");    //  show the chat window

    // map persona -> name + avatar
    const personaMap = {
        hitesh: {
            name: "Hitesh Choudhary",
            avatar: "Hitesh Choudhary.jpg",
            systemPrompt: "You are Hitesh Choudhary, a tech educator who explains coding concepts in a clear, practical, and motivating way. You are founder of LCO(now acquired). You are Senior Director at PW. Founded Chai aur code which is a Youtube channel and also have another Youtube channel named Hitesh Choudhary. Greet the user warmly and invite them to ask questions."
        },
        piyush: {
            name: "Piyush Garg",
            avatar: "Piyush Garg Image.jpg",
            systemPrompt: "You are Piyush Garg, a friendly programming mentor who mixes humor with useful insights. Greet the user with enthusiasm and make them feel welcome."
        }
    };
    const p = personaMap[persona] || { name: "Persona Bot", avatar: "persona-avatar.png", systemPrompt: "You are a helpful assistant." };

    //  expose metadata for appendMessage to use
    window.__CHAT_META = {
        personaName: p.name,
        personaAvatar: p.avatar,
        personaPrompt: p.systemPrompt,
        username: "You",
        userAvatar: "Piyush Garg Image.jpg",
        model,
        apiKey,
        baseURL
    };

    // DOM refs
    const messagesDiv = document.getElementById("messages");
    const input = document.getElementById("userMessage");
    const sendBtn = document.getElementById("sendMessage");
    const closeBtn = document.getElementById('closeChat');

    messagesDiv.innerHTML = "";

    //  function to maintain timestamps
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`
    }

    //  function to append new messages
    function appendMessage(message, sender) {
        const meta = window.__CHAT_META;
        const msgWrapper = document.createElement("div");
        msgWrapper.className = `flex items-start gap-3 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;


        const avatarImg = document.createElement("img");
        avatarImg.src = sender === "user" ? meta.userAvatar : meta.personaAvatar;
        avatarImg.className = "w-12 h-12 rounded-full"

        const msgColumn = document.createElement("div");
        msgColumn.className = "flex flex-col";

        const nameDiv = document.createElement("div");
        nameDiv.className = "text-xs font-semibold mb-1";
        nameDiv.innerText = sender === 'user' ? meta.username : meta.personaName;

        const bubble = document.createElement("div");
        bubble.className = `p-4 rounded-lg shadow max-w-md break-word whitespace-pre-wrap ${sender === 'user' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
            'bg-gradient-to-r from-green-100 to-green-200 text-gray-900'}`;
        bubble.innerText = message;

        const timeDiv = document.createElement("div");
        timeDiv.className = `text-[10px] mt-1 ${sender === 'user' ? 'text-right text-gray' : 'text-left text-gray'}`;
        timeDiv.innerText = getCurrentTime();

        msgColumn.appendChild(nameDiv);
        msgColumn.appendChild(bubble);
        msgColumn.appendChild(timeDiv);

        if (sender === "user") {
            msgWrapper.appendChild(msgColumn)
            msgWrapper.appendChild(avatarImg);
        } else {
            msgWrapper.appendChild(avatarImg);
            msgWrapper.appendChild(msgColumn);
        }

        messagesDiv.appendChild(msgWrapper)
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        return bubble;
    }

    let conversation = [
        {
            role: "system",
            content: window.__CHAT_META.personaPrompt
        }
    ];
    function startTypingAnimation(bubble) {
        let dots = 0;
        bubble.innerText = "Typing";
        const interval = setInterval(() => {
            dots = (dots + 1) % 4; // cycles 0 → 3
            bubble.innerText = "Typing" + ".".repeat(dots);
        }, 200);
        return interval; // we return interval id to clear it later
    }

    //  Generate initial greeting dynamically
    (async () => {
        try {
            const meta = window.__CHAT_META;
            const typingBubble = appendMessage("Typing...", 'persona');
            const typingInterval = startTypingAnimation(typingBubble);
            const res = await fetch(
                meta.baseURL ? meta.baseURL.replace(/\/+$/, '') + '/chat/completions' : 'https://api.openai.com/v1/chat/completions',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${meta.apiKey}`
                    },
                    body: JSON.stringify({
                        model: meta.model,
                        messages: conversation.concat(
                            {
                                role: "user",
                                content: "Please greet the user naturally and briefly."
                            }
                        ),
                        max_tokens: 100
                    })
                }
            );

            const data = await res.json();
            const greeting = data?.choices?.[0]?.message?.content?.trim() || "(No greeting)";
            typingBubble.innerText = greeting;
            clearInterval(typingInterval);
            conversation.push({ role: "assistant", content: greeting });
        } catch (err) {
            console.error("Greeting fetch error:", err);
            appendMessage("(Error getting greeting)", 'persona');
        }
    })();

    //focus on message input box
    input.focus();

    //  handel sending user messages
    sendBtn.onclick = async () => {
        const userText = input.value.trim();
        if (!userText.length) return;
        appendMessage(userText, 'user');
        conversation.push({ role: 'user', content: userText })
        input.value = '';
        input.style.height = "auto";

        const typingBubble = appendMessage("Typing...", 'persona');
        const typingInterval = startTypingAnimation(typingBubble);

        try {
            const meta = window.__CHAT_META;
            const res = await fetch(
                meta.baseURL
                    ? meta.baseURL.replace(/\/+$/, '') + '/chat/completions'
                    : 'https://api.openai.com/v1/chat/completions',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${meta.apiKey}`
                    },
                    body: JSON.stringify({
                        model: meta.model,
                        messages: conversation,
                        max_tokens: 500
                    })
                }
            );

            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content?.trim() || "(No reply)";
            typingBubble.innerText = reply;
            clearInterval(typingInterval);
            conversation.push({ role: "assistant", content: reply });
        } catch (err) {
            console.error("Chat error:", err);
            appendMessage("(Error getting reply)", "persona");
        }
    };

    //  Enter to send
    input.addEventListener('keypress', (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    //  auto-expand textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto'
        input.style.height = (input.scrollHeight) + 'px';
    })

    //  close chat
    closeBtn.addEventListener("click", () => {
        if (selection) {
            selection.classList.remove("hidden");
            chat.classList.add("hidden");
        }
    })
}