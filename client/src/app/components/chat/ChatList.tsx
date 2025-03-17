"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Chat {
  chatId: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
  };
  latestMessage: {
    content: string;
    createdAt: string;
  } | null;
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get<{ data: Chat[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/get-chats`,
          { withCredentials: true }
        );
        setChats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  return (
    <div>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.chatId}
            onClick={() => onSelectChat(chat.chatId)}
            style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
          >
            <p><strong>{chat.otherUser.name}</strong></p>
            <p>{chat.latestMessage?.content || "No messages yet"}</p>
          </div>
        ))
      ) : (
        <p>No chats yet</p>
      )}
    </div>
  );
};

export default ChatList;