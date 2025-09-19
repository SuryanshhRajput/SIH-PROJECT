import React, { useState } from "react";
import AIChat from "./AIChat";

const subjects = [
  { key: "physics", label: "Physics" },
  { key: "math", label: "Math" },
  { key: "chemistry", label: "Chemistry" },
  { key: "hindi", label: "Hindi" },
  { key: "odia", label: "Odia" },
];

const AIChatPage: React.FC = () => {
  const [topic, setTopic] = useState<string>("physics");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <h2 className="text-3xl font-bold">Interactive AI Tutor (Doraemon Mode) 🤖</h2>
        <p className="text-white/90">Choose a subject and start chatting with the friendly tutor!</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s.key}
            onClick={() => setTopic(s.key)}
            className={`px-4 py-2 rounded-xl border ${topic === s.key ? 'bg-indigo-600 text-white' : 'bg-white'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AIChat mode="page" topic={topic} />
    </div>
  );
};

export default AIChatPage;


