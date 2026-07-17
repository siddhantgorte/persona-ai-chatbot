import { Link } from "react-router-dom";
import PersonaCard from "./PersonaCard";

function Sidebar({
    persona,
    setPersona,
    messages,
    setMessages,
    setShowModal,
}) {
    const changePersona = ( name, description, welcomeMessage ) => {
        setPersona( {
            name,
            description,
        } );

        setMessages( [
            {
                role: "ai",
                text: welcomeMessage,
            },
        ] );
    };

    return (
        <aside className="sidebar" aria-label="Persona selection">
            <div className="sidebar-top">
                <Link to="/" className="brand" aria-label="Go to home page">
                    <span>Persona AI</span>
                </Link>

                <button
                    className="new-chat-btn"
                    onClick={() => setShowModal(true)}
                >
                    + New Chat
                </button>
            </div>

            <section
                className="persona-section"
                aria-labelledby="persona-heading"
            >
                <h2 id="persona-heading">Personas</h2>

                <PersonaCard
                    name="Developer"
                    shortDescription="Code and debugging help"
                    description="Ask coding questions, get explanations, and build faster."
                    active={persona.name === "Developer"}
                    onClick={() =>
                        changePersona(
                            "Developer",
                            "Ask coding questions, get explanations, and build faster.",
                            "Hello! I am your Developer Persona. What would you like to build today?"
                        )
                    }
                />

                <PersonaCard
                    name="Mentor"
                    shortDescription="Guidance and learning path"
                    description="Learn with practical guidance, structure, and clear next steps."
                    active={persona.name === "Mentor"}
                    onClick={() =>
                        changePersona(
                            "Mentor",
                            "Learn with practical guidance, structure, and clear next steps.",
                            "Hello! I am your Mentor Persona. What would you like to learn today?"
                        )
                    }
                />

                <PersonaCard
                    name="Friend"
                    shortDescription="Friendly casual conversation"
                    description="Enjoy easygoing, friendly, and supportive conversations."
                    active={persona.name === "Friend"}
                    onClick={() =>
                        changePersona(
                            "Friend",
                            "Enjoy easygoing, friendly, and supportive conversations.",
                            "Hey! I am your Friend Persona. What's on your mind today?"
                        )
                    }
                />
            </section>
        </aside>
    );
}

export default Sidebar;