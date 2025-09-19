import React, { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface AIChatProps {
  mode?: "floating" | "page";
  topic?: string; // physics, math, chemistry, language
}

const AIChat: React.FC<AIChatProps> = ({ mode = "floating", topic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const apiKey = useMemo(() => process.env.REACT_APP_OPENAI_API_KEY, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const formatForDisplay = (text: string) => {
    // very lightweight markdown: **bold**, *italics*, newlines
    let t = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
    return t;
  };

  const sendMessage = async () => {
    setError("");
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (!apiKey) {
      setError("Missing OpenAI API key. Add REACT_APP_OPENAI_API_KEY in .env.local and restart.");
      return;
    }

    const newUserMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const subjectContext = topic
        ? `Focus your help on ${topic}. If user asks outside, still help but relate with kid-friendly examples.`
        : "";
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              `You are VidyaVerse AI, a friendly cartoon tutor (like Doraemon) for kids. Speak playfully, use emojis, and explain step-by-step in simple words. Use short paragraphs, bullets, and bold for key ideas. ${subjectContext}`,
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: trimmed },
        ],
        temperature: 0.7,
        max_tokens: 600,
      } as any;

      const res = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `OpenAI error: ${res.status}`);
      }
      const data = await res.json();
      const answer: string = data?.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";
      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: any) {
      setError(e?.message || "Something went wrong while contacting OpenAI.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      {mode === "floating" && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-0 shadow-xl transform hover:scale-105 transition bg-transparent"
          aria-label="Open AI Chat"
        >
          {/* Doraemon-like simple SVG icon */}
          <svg width="60" height="60" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="58" fill="#2b7fff" />
            <circle cx="60" cy="65" r="40" fill="#ffffff" />
            <circle cx="45" cy="55" r="8" fill="#000000" />
            <circle cx="75" cy="55" r="8" fill="#000000" />
            <circle cx="60" cy="70" r="5" fill="#ff3b30" />
            <path d="M30 85 Q60 105 90 85" stroke="#000000" strokeWidth="4" fill="none" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {(mode === "page" || isOpen) && (
        <div className={`${mode === 'page' ? 'w-full h-[70vh]' : 'w-[340px] sm:w-[380px] h-[500px]'} bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
            <div className="font-semibold">Ask VidyaVerse AI 🤖</div>
            {mode === "floating" && (
              <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">✖</button>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-sm text-gray-600">
                Tip: Ask things like "Explain gravity like I’m 10" or "Help me solve F = ma problems".
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] p-3 rounded-xl shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white self-end ml-auto' : 'bg-white text-gray-800 border border-gray-200'} `}>
                {m.role === 'assistant' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatForDisplay(m.content) }} />
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-600">Thinking… ✨</div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a physics question…"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;


