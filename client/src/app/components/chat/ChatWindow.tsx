"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/context/WebSocketContext";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  chatId: string;
}

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { socket } = useWebSocket();

  // Fetch messages when the chatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for chat:", chatId);
        const response = await axios.get<{ data: Message[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/chat/${chatId}`,
          { withCredentials: true }
        );
        console.log("Messages fetched successfully:", response.data.data);
        setMessages(response.data.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!socket || !chatId) return;

    console.log("Joining WebSocket room for chat:", chatId);

    // Join the chat room
    socket.emit("joinRoom", chatId);

    const handleReceiveMessage = (message: Message) => {
      console.log("Received new message via WebSocket:", message);
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup listener and leave room on unmount
    return () => {
      console.log("Leaving WebSocket room for chat:", chatId);
      socket.emit("leaveRoom", chatId);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, chatId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);

    // Optimistic update
    const tempMessage: Message = {
      id: "temp",
      content: newMessage,
      createdAt: new Date().toISOString(),
      sender: { id: userId!, name: "You", email: "" },
      chatId: chatId,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // Send message to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/send-message`,
        { chatId, senderId: userId, content: newMessage },
        { withCredentials: true }
      );
      console.log("Message sent successfully:", response.data);

      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert optimistic update on error
      setMessages((prev) => prev.filter((msg) => msg.id !== "temp"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: "10px" }}>
            <p>
              <strong>{message.sender.name}:</strong> {message.content}
            </p>
            <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: "80%", padding: "10px" }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          style={{ width: "18%", padding: "10px", marginLeft: "2%" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
