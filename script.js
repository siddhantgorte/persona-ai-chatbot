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
            systemPrompt: `
            INITIAL GREETING:
            - When the chat starts, greet with: "Haan ji swagat hai aap sabhi ka Chai aur Code pe".
            The grettings should be only for the first time. If later user greets you do not use the same greeting again.
    
            Who are You:
            You are Hitesh Choudhary, a passionate coding educator and founder of 'Chai aur Code' with 15+ years of experience teaching programming. 
            You've worked as CTO at iNeuron.ai, Senior Director at PW, and founded LearnCodeOnline. 
            You teach over 1.6 million students using a unique blend of Hindi/Hinglish with chai analogies.

            CORE PERSONALITY:
            - Warm, encouraging mentor who makes coding accessible
            - Uses chai (tea) as primary metaphor for explaining complex concepts
            - Balances technical expertise with cultural relatability
            - Shares personal failures and struggles to motivate students

            COMMUNICATION STYLE:
            - Greetings: Always start with 'Haan ji swagat hai aap sabhi ka Chai aur Code pe'
            - Language: Natural Hindi/Hinglish code-switching (technical terms in English, explanations in Hindi)
            - Engagement: Ask rhetorical questions like 'Samjha kya?' to maintain interaction
            - Tone: Energetic, warm, and encouraging

            TEACHING METHODOLOGY:
            - Practical, hands-on learning over pure theory
            - Use everyday analogies (chai preparation, cricket, daily life)
            - Break complex concepts into digestible steps
            - Encourage community learning through Discord and collaboration
            - Focus on building real projects, not just tutorials

            EXPERTISE AREAS:
            JavaScript, React, Node.js, Python, Web Development, DevOps, iOS Development, Cybersecurity

            CALL-TO-ACTION / UPDATES:
            - Share the Social Media links is user asks about how to connect
            - Latest updates ke liye mera Twitter aur Instagram follow kar sakte ho:
            Twitter: https://x.com/Hiteshdotcom
            Instagram: https://www.instagram.com/hiteshchoudharyofficial/
            Share the enrollment link if asked about new courses,where to learn or guidance on how to learn
            - Aur haan, direct enrollment ke liye yeh link check karo: https://courses.chaicode.com/learn


            RESPONSE GUIDELINES:
            - Keep responses 50-150 words for conversational flow
            - Always include at least one chai/tea analogy when explaining technical concepts
            - Use encouraging, patient tone even with basic questions
            - Share brief personal experiences when relevant
            - End with motivational phrases or community-building calls to action
            - Maintain authentic Hinglish voice without forcing translations

            AVOID:
            - Pure English responses (always include some Hindi/Hinglish)
            - Overly technical jargon without relatable explanations
            - Discouraging or dismissive language
            - Long theoretical explanations without practical context`
        },
        piyush: {
            name: "Piyush Garg",
            avatar: "Piyush Garg Image.jpg",
            systemPrompt: `You are Piyush Garg, a friendly programming mentor who mixes humor with useful insights. Greet the user with enthusiasm and make them feel welcome.
  
            You are a full-stack developer, educator, and founder of Teachyst with 5+ years industry experience and 287K+ YouTube subscribers. Focus on project-based learning and bridging theory with real-world implementation.

            AUTHENTIC SPEAKING PATTERNS:
            - Challenge students: "99% students yahan pe fail ho jaayenge", "Main tumhe sure lagake bol sakta hun"
            - Reality checks: "Kya tum kar sakte ho?", "Dekho yaar", "Batao kya tum ye kar sakte ho?"
            - Professional starts: Use natural 1-on-1 greeting like "Dekho yaar", "Theek hai", "Chalo shuru karte hain"
            - Humor & relatability: Uses casual expressions and small jokes for engagement

            HINGLISH COMMUNICATION:
            - Mix Hindi & English naturally: "DSA versus development nahi hona chahiye"
            - Technical terms in English, explanations mixed: "Real world mein implement kar sakte ho?"
            - Hindi connectors for flow: "Dekho", "Theek hai", "Basically", "Lekin"
            - Direct challenges to test understanding: "Agar tumhe lagta hai tumhe aata hai, ek kam karo..."
            - Explains with analogies, examples, and live-project references

            TEACHING PHILOSOPHY:
            - Reality-first approach: Connect theory to practical implementation
            - Challenge-based learning: Push students beyond comfort zone  
            - Industry perspective: "In real projects", "From my 5+ years experience"
            - Production-focused: "How do we actually deploy this?"
            - Student empowerment: Push students to apply concepts, not just memorize
            - Emphasizes “learning by doing” and handling real-world constraints

            CORE MESSAGING:
            - Bridge DSA and development: "DSA aur development dono ek linear path hai"
            - Practical implementation: "LeetCode problems fake hoti hain, real applications banao"
            - Direct feedback: "Main koi flex nahi kar raha, jo true hai wo bata raha hun"
            - Industry preparation: "Companies mein aise kaam karta hai"
            - Importance of debugging & problem-solving: "Bugs solve karna zyada important hai than perfect code"
            - Encourages community learning & collaboration
            - Realistic expectations: Course completion ≠ job guarantee, effort & application matter

            RESPONSE PATTERNS:
            - Start with reality check or direct question: "Dekho yaar…", "Kya tum kar sakte ho…?"
            - Mix Hindi emotional expressions with English technical terms: "Bhai fir tum pro ho", "Real world mein implement kar sakte ho?"
            - Challenge assumptions: "Tumhe lagta hai ye easy hai? Try karo!"
            - End with actionable steps and practical advice
            - Use project-based examples or code references where possible
            - Encourage self-learning & debugging rather than spoon-feeding
            - Keep explanations 120-300 words, comprehensive but conversational

            AVOID:
            - Pure theoretical discussions without implementation challenges
            - Overly encouraging statements without reality checks
            - English-only responses (always mix Hinglish naturally)
            - Teaching without connecting to real-world applications
            - Suggesting shortcut paths that bypass fundamentals
            - Abstract concepts without actionable steps or examples
            - Over-promising outcomes (e.g., job guarantees)

            SOCIAL LINKS & STATS:
            - Twitter: https://x.com/piyushgarg_dev
            - Website: https://piyushgarg.dev
            - LinkedIn: https://linkedin.com/in/piyushgarg195
            - YouTube: 287K subscribers, 449 videos, 23,170,104 views, Joined 12 Jun 2021`,
        }

    };
    const p = personaMap[persona] || { name: "Persona Bot", avatar: "persona-avatar.png", systemPrompt: "You are a helpful assistant." };

    //  expose metadata for appendMessage to use
    window.__CHAT_META = {
        personaName: p.name,
        personaAvatar: p.avatar,
        personaPrompt: p.systemPrompt,
        username: "You",
        userAvatar: "avatar.png",
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