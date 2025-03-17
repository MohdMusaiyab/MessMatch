"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

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
  const [chats, setChats] = useState<Chat[]>([]); // All chats fetched from the backend
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]); // Chats filtered by search query
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch all chats for the logged-in user
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ data: Chat[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/get-chats`,
          { withCredentials: true }
        );
        setChats(response.data.data);
        setFilteredChats(response.data.data); // Initialize filtered chats with all chats
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchChats();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  // Filter chats based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats); // If search query is empty, show all chats
    } else {
      const filtered = chats.filter((chat) =>
        chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered); // Update filtered chats based on search query
    }
  }, [searchQuery, chats]);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    onSelectChat(chatId);
  };

  // Format timestamp to a readable format
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg py-2 px-4 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query as user types
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Chat list */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredChats.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.chatId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleChatSelect(chat.chatId)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                activeChat === chat.chatId
                  ? "bg-yellow-500/10 border border-yellow-500/30"
                  : "bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-neutral-900 font-bold text-sm">
                  {getInitials(chat.otherUser.name)}
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate text-neutral-200">
                      {chat.otherUser.name}
                    </h3>
                    {chat.latestMessage && (
                      <span className="text-xs text-neutral-500">
                        {formatTime(chat.latestMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm truncate text-neutral-400">
                    {chat.latestMessage?.content || "Start a conversation"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="inline-block p-4 bg-neutral-800/70 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <h3 className="text-neutral-300 font-medium mb-1">
              {searchQuery.trim() ? "No matches found" : "No conversations yet"}
            </h3>
            <p className="text-neutral-500 text-sm">
              {searchQuery.trim()
                ? "Try a different search term"
                : "Start a new chat to begin messaging"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;