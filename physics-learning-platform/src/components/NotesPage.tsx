import React from "react";
import { Download } from "lucide-react";
import { StudyNote } from "../types";

interface NotesPageProps {
  studyNotes: StudyNote[];
  addNotification: (message: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ studyNotes, addNotification }) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Study Notes</h2>

    <div className="space-y-6">
      {studyNotes.map((note, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([`${note.title}\n\n${note.content}`], { type: "text/plain" });
                element.href = URL.createObjectURL(file);
                element.download = `${note.title.replace(/\s+/g, "_")}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                addNotification(`Downloaded: ${note.title}`);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">{note.content}</p>
        </div>
      ))}
    </div>
  </div>
);

export default NotesPage;
