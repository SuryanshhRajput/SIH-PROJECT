import React, { useState } from "react";
import { User, Settings } from "lucide-react";
import { User as UserType } from "../types";

interface ProfilePageProps {
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  users: UserType[];
  setUsers: (users: UserType[]) => void;
  addNotification: (message: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, setCurrentUser, users, setUsers, addNotification }) => {
  const [profileData, setProfileData] = useState({
    name: currentUser?.profile?.name || "",
    email: currentUser?.profile?.email || "",
    grade: currentUser?.profile?.grade || "10th",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      profile: profileData,
    };
    setCurrentUser(updatedUser);
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsEditing(false);
    addNotification("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{currentUser?.username}</h3>
              <p className="text-gray-600">Student</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Settings className="w-4 h-4" />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{profileData.name || "Not set"}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{profileData.email || "Not set"}</p>
            )}
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            {isEditing ? (
              <select
                value={profileData.grade}
                onChange={(e) =>
                  setProfileData({ ...profileData, grade: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            ) : (
              <p className="text-gray-800">{profileData.grade}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Learning Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {currentUser?.progress?.completedLessons || 0}
            </p>
            <p className="text-gray-700">Lessons Completed</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {currentUser?.progress?.quizScores?.length || 0}
            </p>
            <p className="text-gray-700">Quizzes Taken</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
