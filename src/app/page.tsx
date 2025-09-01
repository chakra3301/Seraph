"use client";

import { useEffect, useRef, useState } from "react";

type Role = "user" | "angel";
type ChatMsg = { id: string; role: Role; text: string };

const angelicQuestions = [
  "What does it mean to truly exist in this vast universe?",
  "If time is but a construct of human perception, what is the nature of eternity?",
  "What is the essence of consciousness, and where does the soul reside?",
  "In the grand tapestry of existence, what role do you believe you play?",
  "What is the nature of love, and how does it transcend the physical realm?",
  "If you could speak to your future self, what would you ask?",
  "What does it mean to be free in a world bound by cause and effect?",
  "How do you define truth, and is it absolute or relative?",
  "What is the purpose of suffering in the human experience?",
  "If you could choose one virtue to embody for eternity, what would it be?",
  "What is the relationship between mind and matter?",
  "How do you understand the concept of infinity?",
  "What does it mean to be authentic in a world of masks?",
  "If you could witness any moment in history, what would you choose?",
  "What is the nature of beauty, and why does it move us so deeply?",
  "How do you define wisdom, and where does it come from?",
  "What is the meaning of death in the cycle of life?",
  "If you could ask the universe one question, what would it be?",
  "What is the essence of creativity, and how does it connect us to the divine?",
  "How do you understand the concept of destiny versus free will?"
];

export default function Page() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const [asked, setAsked] = useState<number[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [titleGlow, setTitleGlow] = useState(false);

  const particlesRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const wingsRef = useRef<HTMLDivElement | null>(null);

  const addMsg = (role: Role, text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text }]);
  };

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;
      const particle = document.createElement("div");
      particle.className = "particle";
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 10;
      const duration = Math.random() * 6 + 6;
      const delay = Math.random() * 2;

      particle.style.cssText = `
        width:${size}px;height:${size}px;
        left:${startX}px;top:${startY}px;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
      `;
      particlesRef.current.appendChild(particle);

      const removeAfter = setTimeout(() => particle.remove(), (duration + delay) * 3000);
      return () => clearTimeout(removeAfter);
    };

    Array.from({ length: 15 }, () => createParticle());
    const interval = setInterval(createParticle, 3000);

    let glow = 0.3;
    let inc = true;
    const glowTimer = setInterval(() => {
      const vo = videoOverlayRef.current;
      if (!vo) return;
      glow += inc ? 0.001 : -0.001;
      if (glow >= 0.4) inc = false;
      if (glow <= 0.2) inc = true;
      vo.style.background = `linear-gradient(
        135deg,
        rgba(0,0,0,${0.3 + glow}) 0%,
        rgba(25,25,112,${0.2 + glow * 0.5}) 50%,
        rgba(0,0,0,${0.4 + glow}) 100%
      )`;
    }, 50);

    const whisperSymbols = ["✧", "✦", "✩", "✪", "✫"];
    const whisperInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const w = document.createElement("div");
        w.textContent = whisperSymbols[Math.floor(Math.random() * whisperSymbols.length)];
        w.style.cssText = `
          position: fixed; color: rgba(255,255,255,0.3); font-size:1.5rem;
          pointer-events:none; z-index:1000;
          left:${Math.random() * window.innerWidth}px; top:${Math.random() * window.innerHeight}px;
          animation: fadeInOut 3s ease-in-out forwards;
        `;
        document.body.appendChild(w);
        setTimeout(() => w.remove(), 3000);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(glowTimer);
      clearInterval(whisperInterval);
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!wingsRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      wingsRef.current.style.transform = `translate(-50%, -50%) rotateX(${(y - 0.5) * 5}deg) rotateY(${(x - 0.5) * 5}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // seed welcome + first question on mount
useEffect(() => {
  // only seed once (when no messages yet)
  setMessages((prev) => {
    if (prev.length > 0) return prev;
    return [
      { id: crypto.randomUUID(), role: "angel", text: "Welcome, seeker. I am here to guide you through the depths of your own consciousness. What shall we explore today?" },
      { id: crypto.randomUUID(), role: "angel", text: angelicQuestions[0] },
    ];
  });
  // mark the first question as asked so the API picks the next one
  setAsked([0]);
}, []);


  const buildAiMessages = () =>
    messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isWaiting) return;

    addMsg("user", text);
    setInput("");
    setIsWaiting(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "angel", text: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: buildAiMessages(),
        askedIndices: asked,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.body) {
      setIsWaiting(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + chunk } : m))
      );
    }

    setIsWaiting(false);
  };

  return (
    <>
      <div className="video-background">
        <video autoPlay muted loop id="bgVideo">
          <source src="/artifact.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" ref={videoOverlayRef}></div>
      </div>

      <div className="particles" id="particles" ref={particlesRef}></div>

      <div className="container">
        <header className="header">
          <h1
            className={`title ${titleGlow ? "glow" : ""}`}
            onMouseEnter={() => setTitleGlow(true)}
            onMouseLeave={() => setTitleGlow(false)}
          >
            Seraph
          </h1>
          <p className="subtitle">Divine Conversations with the Angel</p>
        </header>

        <div className="hamburger-menu">
          <div
            className={`hamburger-icon ${menuOpen ? "active" : ""}`}
            id="hamburgerIcon"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div
            className={`menu-overlay ${menuOpen ? "active" : ""}`}
            id="menuOverlay"
            onClick={(e) => {
              if (e.currentTarget === e.target) setMenuOpen(false);
            }}
          >
            <div className="menu-content">
              <div className="menu-header">
                <button className="close-button" id="closeButton" onClick={() => setMenuOpen(false)}>
                  <span></span>
                  <span></span>
                </button>
                <h2 className="menu-title">Seraph</h2>
                <p className="menu-subtitle">Divine Connections</p>
              </div>
              <div className="menu-buttons">
                <a href="#" className="menu-button twitter">
                  <span className="button-icon">𝕏</span>
                  <span className="button-text">Twitter</span>
                </a>
                <a href="#" className="menu-button telegram">
                  <span className="button-icon">✧</span>
                  <span className="button-text">Telegram</span>
                </a>
                <a href="#" className="menu-button dexscreener">
                  <span className="button-icon">✦</span>
                  <span className="button-text">DexScreener</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages" id="chatMessages" ref={chatRef}>
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="message-content">
                  <p className="message-text">{m.text}</p>
                </div>
              </div>
            ))}
            {isWaiting && (
              <div className="message angel typing-indicator" id="typingIndicator">
                <div className="message-content">
                  <p className="message-text">
                    <span className="loading"></span> The angel is contemplating your response...
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <form id="chatForm" className="chat-form" onSubmit={onSubmit}>
              <input
                type="text"
                id="userInput"
                className="chat-input"
                placeholder="Share your thoughts..."
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                ref={inputRef}
                disabled={isWaiting}
              />
              <button type="submit" className="send-button" disabled={isWaiting || !input.trim()}>
                <span className="send-icon">✧</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="angel-wings" ref={wingsRef}>
        <div className="wing left-wing"></div>
        <div className="wing right-wing"></div>
      </div>
    </>
  );
}
