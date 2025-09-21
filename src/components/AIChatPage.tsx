import React, { useState, useEffect, useRef } from "react";
import { Send, Plus, MessageSquare, Bot, Target, ArrowLeft } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const subjects = [
  { key: "physics", label: "Physics", icon: "⚛️", color: "from-blue-500 to-indigo-600" },
  { key: "math", label: "Mathematics", icon: "🧮", color: "from-green-500 to-emerald-600" },
  { key: "chemistry", label: "Chemistry", icon: "🧪", color: "from-purple-500 to-violet-600" },
  { key: "hindi", label: "Hindi", icon: "📚", color: "from-orange-500 to-red-600" },
  { key: "odia", label: "Odia", icon: "🌾", color: "from-yellow-500 to-orange-600" },
];

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const AIChatPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatForDisplay = (text: string) => {
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

    setShowWelcome(false);

    const newUserMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const subjectContext = `Focus your help on ${selectedSubject}. If user asks outside, still help but relate with kid-friendly examples.`;
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are VidyaVerse AI, a friendly cartoon tutor (like Doraemon) for kids. Speak playfully, use emojis, and explain step-by-step in simple words. Use short paragraphs, bullets, and bold for key ideas. ${subjectContext}`,
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

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setError("");
  };

  const getSubjectInfo = () => {
    return subjects.find(s => s.key === selectedSubject) || subjects[0];
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">VidyaVerse AI</h1>
            </div>
            
            {/* Subject Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {subjects.map((subject) => (
                  <option key={subject.key} value={subject.key}>
                    {subject.icon} {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {showWelcome && messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome to VidyaVerse AI! 🤖
                </h2>
                <p className="text-gray-600 text-lg">
                  Your friendly learning companion for {getSubjectInfo().label} {getSubjectInfo().icon}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Ask Questions</h3>
                  <p className="text-sm text-gray-600">"Explain gravity like I'm 10" or "Help me solve F = ma problems"</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Get Help</h3>
                  <p className="text-sm text-gray-600">Step-by-step explanations with examples and practice problems</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">🚀 Learn Faster</h3>
                  <p className="text-sm text-gray-600">Interactive learning with visual aids and fun examples</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">🎮 Make it Fun</h3>
                  <p className="text-sm text-gray-600">Learning through games, stories, and interactive content</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 mb-4">Start by typing a question below 👇</p>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}>
                  {m.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatForDisplay(m.content) }} />
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-600">Thinking… ✨</span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Ask me anything about ${getSubjectInfo().label}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                rows={1}
                disabled={loading}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;


