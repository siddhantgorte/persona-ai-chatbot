import { Link } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";

import heroImage from "../assets/Persona AI Image.png";

function LandingPage() {
    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:z-50"
            >
                Skip to main content
            </a>

            {/* NAVBAR */}

            <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <a href="#home" className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold">
                            Persona AI Chatbot
                        </h1>
                    </a>

                    <nav className="hidden md:flex gap-8 text-sm text-gray-300">
                        <a href="#features" className="hover:text-white transition">
                            Features
                        </a>

                        <a href="#personas" className="hover:text-white transition">
                            Personas
                        </a>

                        <a href="#how" className="hover:text-white transition">
                            How It Works
                        </a>
                    </nav>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-white text-black px-5 py-2 rounded-full font-medium hover:scale-105 transition">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/chat"
                                className="bg-white text-black px-5 py-2 rounded-full font-medium hover:scale-105 transition"
                            >
                                Start Chat
                            </Link>

                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </header>

            <main id="main-content">

                {/* HERO */}

                <section
                    id="home"
                    className="min-h-screen flex items-center"
                >
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                        <div className="space-y-6">

                            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                                Chat with AI Personas
                            </h2>

                            <p className="text-gray-300 text-lg">
                                Start real conversations with specialized AI
                                personas for coding support, mentorship, and
                                everyday friendly chats.
                            </p>

                            <SignedIn>
                                <Link
                                    to="/chat"
                                    className="inline-block bg-gradient-to-r from-white to-gray-300 text-black px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
                                >
                                    Get Started
                                </Link>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="inline-block bg-gradient-to-r from-white to-gray-300 text-black px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg">
                                        Get Started
                                    </button>
                                </SignInButton>
                            </SignedOut>

                        </div>

                        <div className="flex justify-center">
                            <img
                                src={heroImage}
                                alt="Persona AI"
                                className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500 w-full max-w-xl"
                            />
                        </div>

                    </div>
                </section>

                {/* FEATURES */}

                <section
                    id="features"
                    className="py-20 bg-black/30"
                >
                    <div className="max-w-6xl mx-auto px-6 text-center">

                        <h2 className="text-3xl font-bold mb-12">
                            Features
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                            {[
                                ["Multiple AI Personas", "Switch between personalities in one click."],
                                ["Real-time Chat", "Get smooth, instant AI responses."],
                                ["Clean Interface", "Minimal UI to keep focus on your conversation."],
                                ["Easy Switching", "Move between personas without losing momentum."],
                            ].map(([title, desc]) => (
                                <article
                                    key={title}
                                    className="p-6 bg-softGray rounded-xl hover:-translate-y-2 transition"
                                >
                                    <h3 className="font-semibold text-lg mb-2">
                                        {title}
                                    </h3>

                                    <p className="text-gray-300 text-sm">
                                        {desc}
                                    </p>
                                </article>
                            ))}

                        </div>
                    </div>
                </section>

                {/* PERSONAS */}

                <section id="personas" className="py-20">
                    <div className="max-w-6xl mx-auto px-6 text-center">

                        <h2 className="text-3xl font-bold mb-12">
                            Available Personas
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">

                            {[
                                ["Developer Persona", "Helps with coding, debugging, and technical concepts."],
                                ["Mentor Persona", "Supports learning with guidance and practical advice."],
                                ["Friend Persona", "Enjoy casual, light, and friendly conversations."],
                            ].map(([title, desc]) => (
                                <article
                                    key={title}
                                    className="p-8 bg-softGray rounded-2xl hover:scale-105 transition"
                                >
                                    <h3 className="text-xl font-semibold mb-3">
                                        {title}
                                    </h3>

                                    <p className="text-gray-300">
                                        {desc}
                                    </p>
                                </article>
                            ))}

                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}

                <section
                    id="how"
                    className="py-20 bg-black/30"
                >
                    <div className="max-w-4xl mx-auto px-6 text-center">

                        <h2 className="text-3xl font-bold mb-10">
                            How It Works
                        </h2>

                        <ol className="space-y-6 text-gray-300 text-lg text-left md:text-center list-decimal list-inside">
                            <li>Select an AI persona based on what you need.</li>
                            <li>Start chatting instantly on the chat page.</li>
                            <li>Get smart responses in real time.</li>
                        </ol>

                    </div>
                </section>

            </main>

            {/* FOOTER */}

            <footer className="bg-black/40 border-t border-white/10 py-14">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-gray-400 text-sm">

                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            Persona AI
                        </h3>

                        <p>
                            Interactive AI conversations built for different personalities.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-3">Product</h4>

                        <ul className="space-y-2">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#personas">Personas</a></li>
                            <li><a href="#how">How it Works</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-3">Company</h4>

                        <ul className="space-y-2">
                            <li><a href="https://github.com/siddhantgorte">GitHub</a></li>
                            <li><a href="https://www.linkedin.com/in/siddhantgorte/">LinkedIn</a></li>
                            <li><a href="https://x.com/siddhantgorte">X (Twitter)</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-3">Legal</h4>

                        <ul className="space-y-2">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                </div>

                <div className="text-center text-gray-500 mt-10 text-xs">
                    © 2026 Persona AI Chatbot. All rights reserved.
                </div>
            </footer>
        </>
    );
}

export default LandingPage;