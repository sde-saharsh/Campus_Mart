import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      // 1. Fetch initial count
      api.get("/chat/unread/count")
        .then(res => {
          if (res.data.success) {
             setUnreadCount(res.data.count);
             setNotifications(res.data.conversations || []);
          }
        })
        .catch(err => console.error("Failed to fetch unread count", err));

      // 2. Connect Socket for Global Notifications
      // Note: We are using a separate socket connection or reusing logic?
      // Ideally, we should have a single socket instance for the app.
      // For now, let's create one here which joins the USER room.
      const newSocket = io(import.meta.env.VITE_SOCKET_URL);
      
      newSocket.on("connect", () => {
        // Join user-specific room
        newSocket.emit("join_user_room", user._id);
      });

      newSocket.on("new_message_notification", (data) => {
        // Prevent listing own messages if server emits them back
        if (data.senderId === user._id) return;

        // Increment count
        setUnreadCount(prev => prev + 1);
        
        // Add to notifications list
        setNotifications(prev => {
            // Check if we already have this conversation
            const existing = prev.find(n => n.orderId === data.orderId);
            if (existing) {
                return prev.map(n => n.orderId === data.orderId ? { ...n, count: n.count + 1, lastMessage: data.content } : n);
            } else {
                return [...prev, {
                    orderId: data.orderId,
                    count: 1,
                    senderName: data.senderName,
                    itemTitle: "Order",
                    lastMessage: data.content
                }];
            }
        });
        
        // Optional: Show browser notification or toast here
        // if (Notification.permission === "granted") {
        //   new Notification(`New message from ${data.senderName}`, { body: data.content });
        // }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const markAsRead = async (orderId) => {
    try {
      const res = await api.put(`/chat/read/${orderId}`);
      if (res.data.success) {
        // Refresh count to be accurate
        const countRes = await api.get("/chat/unread/count");
        if (countRes.data.success) {
            setUnreadCount(countRes.data.count);
            setNotifications(countRes.data.conversations || []);
        }
      }
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, markAsRead, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
