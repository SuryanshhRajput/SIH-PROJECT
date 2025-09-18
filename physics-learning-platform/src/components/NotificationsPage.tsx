import React from "react";
import { Bell } from "lucide-react";
import { Notification } from "../types";

interface NotificationsPageProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, setNotifications }) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>

    {notifications.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No notifications
        </h3>
        <p className="text-gray-500">You're all caught up!</p>
      </div>
    ) : (
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <p className="text-gray-800">{notification.message}</p>
            </div>
            <button
              onClick={() =>
                setNotifications(notifications.filter((_, i) => i !== index))
              }
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => setNotifications([])}
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
        >
          Clear All Notifications
        </button>
      </div>
    )}
  </div>
);

export default NotificationsPage;
