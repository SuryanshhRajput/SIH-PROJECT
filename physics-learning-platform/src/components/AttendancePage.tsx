import React, { useMemo, useState } from "react";
import { User } from "lucide-react";
import { User as UserType, AttendanceRecord } from "../types";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface AttendancePageProps {
  currentUser: UserType;
  users: UserType[];
  attendance: AttendanceRecord[];
  setAttendance: (attendance: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => void;
  addNotification: (message: string) => void;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ currentUser, users, attendance, setAttendance, addNotification }) => {
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const students = useMemo(() => {
    const list = (users || []).filter((u) => u.userType === "student");
    return gradeFilter ? list.filter(s => (s.profile?.grade || "").toLowerCase() === gradeFilter.toLowerCase()) : list;
  }, [users, gradeFilter]);
  const allGrades = useMemo(() => {
    const g = new Set<string>();
    (users || []).forEach(u => {
      if (u.userType === 'student' && u.profile?.grade) g.add(u.profile.grade);
    });
    return Array.from(g).sort();
  }, [users]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecord, setAttendanceRecord] = useState({});
  const [saveBanner, setSaveBanner] = useState<string>("");

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecord((prev: any) => ({
      ...prev,
      [`${selectedDate}-${studentId}`]: status,
    }));
  };

  const saveAttendance = async () => {
    // Create attendance records for each student
    const records: AttendanceRecord[] = students.map(student => ({
      studentId: student.id,
      date: selectedDate,
      status: (attendanceRecord as any)[`${selectedDate}-${student.id}`] || 'absent'
    }));
    
    setAttendance((prev) => [...prev, ...records]);
    // write to Firestore
    await Promise.all(records.map(r => addDoc(collection(db, "attendance"), r)));
    addNotification(`Attendance saved for ${selectedDate}`);
    setSaveBanner(`Attendance saved successfully for ${selectedDate}.`);
    setTimeout(() => setSaveBanner(""), 4000);
  };

  const statusFor = (studentId: string) => {
    const rec = (attendance || []).find(a => a.studentId === studentId && a.date === selectedDate);
    return rec?.status;
  };

  // Build CSV for selected grade
  const downloadCsvForGrade = () => {
    const gradeStudents = students;
    const gradeAttendance = (attendance || []).filter(a => gradeStudents.find(s => s.id === a.studentId));
    const dates = Array.from(new Set(gradeAttendance.map(a => a.date))).sort();
    const header = ["Name", "Roll", "Grade", ...dates];
    const rows = gradeStudents.map(s => {
      const row: string[] = [
        JSON.stringify(s.profile?.name || s.username),
        JSON.stringify(s.rollNumber || ""),
        JSON.stringify(s.profile?.grade || ""),
        ...dates.map(d => {
          const rec = gradeAttendance.find(r => r.studentId === s.id && r.date === d);
          return JSON.stringify(rec ? rec.status : "");
        })
      ];
      return row.join(",");
    });
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${gradeFilter || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {saveBanner && (
          <div className="mb-4 px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200">
            {saveBanner}
          </div>
        )}
        {/* Date + Save */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 mx-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Grade</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <button
                onClick={() => setGradeFilter("")}
                className={`px-3 py-2 rounded border ${gradeFilter === '' ? 'bg-indigo-600 text-white' : 'bg-white'}`}
              >All</button>
              {allGrades.map(g => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={`px-3 py-2 rounded border ${gradeFilter === g ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                >{g}</button>
              ))}
            </div>
          </div>

          <button
            onClick={saveAttendance}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Attendance
          </button>
        </div>

        {/* Students List */}
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{student.profile?.name || student.username}</p>
                  <p className="text-sm text-gray-600">
                    {student.profile?.grade || student.email}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => markAttendance(student.id, "present")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    (attendanceRecord as any)[`${selectedDate}-${student.id}`] ===
                    "present"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-green-100"
                  }`}
                >
                  Present
                </button>

                <button
                  onClick={() => markAttendance(student.id, "absent")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    (attendanceRecord as any)[`${selectedDate}-${student.id}`] ===
                    "absent"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-red-100"
                  }`}
                >
                  Absent
                </button>

                <button
                  onClick={() => markAttendance(student.id, "late")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    (attendanceRecord as any)[`${selectedDate}-${student.id}`] === "late"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-100"
                  }`}
                >
                  Late
                </button>
                {statusFor(student.id) && (
                  <span className={`ml-3 px-2 py-1 rounded text-xs border ${
                    statusFor(student.id) === 'present' ? 'bg-green-50 text-green-700 border-green-200' :
                    statusFor(student.id) === 'absent' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    Saved: {statusFor(student.id)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {students.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Attendance Viewer */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Saved Attendance {gradeFilter ? `(Grade: ${gradeFilter})` : ''}</h3>
          <button
            onClick={downloadCsvForGrade}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Download Excel (CSV)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Roll</th>
                <th className="p-2">Grade</th>
                <th className="p-2">Present</th>
                <th className="p-2">Absent</th>
                <th className="p-2">Late</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const recs = (attendance || []).filter(a => a.studentId === s.id);
                const present = recs.filter(r => r.status === 'present').length;
                const absent = recs.filter(r => r.status === 'absent').length;
                const late = recs.filter(r => r.status === 'late').length;
                return (
                  <tr key={s.id} className="border-b">
                    <td className="p-2">{s.profile?.name || s.username}</td>
                    <td className="p-2">{s.rollNumber || '-'}</td>
                    <td className="p-2">{s.profile?.grade || '-'}</td>
                    <td className="p-2">{present}</td>
                    <td className="p-2">{absent}</td>
                    <td className="p-2">{late}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
