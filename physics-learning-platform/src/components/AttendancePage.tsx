import React, { useState } from "react";
import { User } from "lucide-react";
import { User as UserType, AttendanceRecord } from "../types";

interface AttendancePageProps {
  currentUser: UserType;
  users: UserType[];
  attendance: AttendanceRecord[];
  setAttendance: (attendance: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => void;
  addNotification: (message: string) => void;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ currentUser, users, attendance, setAttendance, addNotification }) => {
  const students = (users || []).filter((u) => u.userType === "student");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecord, setAttendanceRecord] = useState({});

  const markAttendance = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecord((prev: any) => ({
      ...prev,
      [`${selectedDate}-${studentId}`]: status,
    }));
  };

  const saveAttendance = () => {
    // Create attendance records for each student
    const records: AttendanceRecord[] = students.map(student => ({
      studentId: student.id,
      date: selectedDate,
      status: (attendanceRecord as any)[`${selectedDate}-${student.id}`] || 'absent'
    }));
    
    setAttendance((prev) => [...prev, ...records]);
    addNotification(`Attendance saved for ${selectedDate}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
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
    </div>
  );
};

export default AttendancePage;
