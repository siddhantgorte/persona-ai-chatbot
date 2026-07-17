import { useState } from "react";

const personas = [
    {
        name: "Developer",
        description: "Ask coding questions, get explanations, and build faster.",
        shortDescription: "Code and debugging help",
    },
    {
        name: "Mentor",
        description: "Learn with practical guidance, structure, and clear next steps.",
        shortDescription: "Guidance and learning path",
    },
    {
        name: "Friend",
        description: "Enjoy easygoing, friendly, and supportive conversations.",
        shortDescription: "Friendly casual conversation",
    },
];

function PersonaModal({
    showModal,
    setShowModal,
    setPersona,
    setMessages,
}) {
    const [selectedPersona, setSelectedPersona] = useState("Developer");

    if (!showModal) return null;

    function startChat() {
        const chosen = personas.find(
            (p) => p.name === selectedPersona
        );

        setPersona({
            name: chosen.name,
            description: chosen.description,
        });

        setMessages([
            {
                role: "ai",
                text: `Hello! I am your ${chosen.name} Persona. How can I help today?`,
            },
        ]);

        setShowModal(false);
    }

    return (
        <div className="persona-modal">
            <div
                className="persona-modal-backdrop"
                onClick={() => setShowModal(false)}
            ></div>

            <div className="persona-modal-panel">
                <h2>Start a New Chat</h2>

                <p>
                    Choose which persona you want to chat
                    with.
                </p>

                <div className="persona-modal-list">
                    {personas.map((persona) => (
                        <button
                            key={persona.name}
                            type="button"
                            className={`persona-modal-option ${
                                selectedPersona === persona.name
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedPersona(
                                    persona.name
                                )
                            }
                        >
                            <span className="persona-name">
                                {persona.name}
                            </span>

                            <span className="persona-desc">
                                {
                                    persona.shortDescription
                                }
                            </span>
                        </button>
                    ))}
                </div>

                <div className="persona-modal-actions">
                    <button
                        className="modal-cancel-btn"
                        onClick={() =>
                            setShowModal(false)
                        }
                    >
                        Cancel
                    </button>

                    <button
                        className="modal-start-btn"
                        onClick={startChat}
                    >
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PersonaModal;