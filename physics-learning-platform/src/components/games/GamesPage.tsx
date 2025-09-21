// GamesPage.tsx
import React, { useEffect, useState } from "react";
import ProjectileGame from "./ProjectileGame";
import FormulaMatch from "./FormulaMatch";
import { db } from "../../firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState("menu");
  const [teacherNote, setTeacherNote] = useState("");
  const [notes, setNotes] = useState<{ game: string; text: string }[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      const snap = await getDocs(collection(db, "gameNotes"));
      setNotes(snap.docs.map((d) => d.data() as any));
    };
    loadNotes();
  }, []);

  const saveNote = async (game: string) => {
    if (!teacherNote.trim()) return;
    const record = { game, text: teacherNote };
    await addDoc(collection(db, "gameNotes"), record);
    setNotes((prev) => [...prev, record]);
    setTeacherNote("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Physics Games 🎮</h2>

      {selectedGame === "menu" && (
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setSelectedGame("projectile")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            🚀 Projectile Motion
          </button>

          <button
            onClick={() => setSelectedGame("formula")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            📐 Formula Match
          </button>
        </div>
      )}

      {selectedGame === "projectile" && (
        <>
          <div className="mb-4 bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Teacher Note for Projectile</h4>
            <textarea
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              rows={3}
              placeholder="Add a note for students"
            />
            <button onClick={() => saveNote("projectile")} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">
              Save Note
            </button>
            <div className="mt-3 text-sm text-gray-700">
              {(notes.filter(n => n.game === "projectile"))?.map((n, idx) => (
                <div key={idx} className="border-t pt-2">{n.text}</div>
              ))}
            </div>
          </div>
          <ProjectileGame goBack={() => setSelectedGame("menu")} />
        </>
      )}
      {selectedGame === "formula" && (
        <>
          <div className="mb-4 bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Teacher Note for Formula Match</h4>
            <textarea
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              rows={3}
              placeholder="Add a note for students"
            />
            <button onClick={() => saveNote("formula")} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">
              Save Note
            </button>
            <div className="mt-3 text-sm text-gray-700">
              {(notes.filter(n => n.game === "formula"))?.map((n, idx) => (
                <div key={idx} className="border-t pt-2">{n.text}</div>
              ))}
            </div>
          </div>
          <FormulaMatch goBack={() => setSelectedGame("menu")} />
        </>
      )}
    </div>
  );
};

export default GamesPage;
