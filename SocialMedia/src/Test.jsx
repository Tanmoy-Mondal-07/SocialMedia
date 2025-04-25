"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  UserPlus,
  X,
} from "lucide-react";

export default function SocialNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      user: { name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
      action: "liked your post",
      post: { title: "Sunset Boulevard", url: "/posts/1" },
      time: "5m",
      read: false,
      type: "like",
    },
    {
      id: "2",
      user: { name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
      action: "commented: \"Amazing view!\"",
      post: { title: "Mountain Hike", url: "/posts/2" },
      time: "1h",
      read: false,
      type: "comment",
    },
    {
      id: "3",
      user: { name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
      action: "started following you",
      time: "Yesterday",
      read: true,
      type: "follow",
    },
    {
      id: "4",
      user: { name: "Dana", avatar: "https://i.pravatar.cc/40?img=4" },
      action: "mentioned you in a comment",
      post: { title: "City Lights", url: "/posts/3" },
      time: "2d",
      read: true,
      type: "mention",
    },
    {
      id: "5",
      user: { name: "Eve", avatar: "https://i.pravatar.cc/40?img=5" },
      action: "sent you a message",
      time: "3d",
      read: true,
      type: "message",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "mention":
        return <Bell className="h-5 w-5 text-purple-500" />;
      case "message":
      default:
        return <Scroll className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </button>
        )}
      </div>

      <ul>
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`flex items-start space-x-3 p-3 rounded-lg mb-2 transition-all hover:bg-gray-50 ${
              !n.read ? 'bg-gray-50' : ''
            }`}
          >
            <img
              src={n.user.avatar}
              alt={n.user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="font-semibold text-gray-800">{n.user.name}</span> {n.action}
                  {n.post && (
                    <span className="font-medium text-blue-600 hover:underline">
                      {' '}{n.post.title}
                    </span>
                  )}
                </p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
              <div className="mt-2 flex space-x-4 text-gray-500">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="flex items-center text-xs hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Read
                  </button>
                )}
                <button className="flex items-center text-xs hover:text-gray-700">
                  Details <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <button
              onClick={() => deleteNotification(n.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>

      {notifications.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No notifications here</p>
        </div>
      )}
    </div>
  );
}