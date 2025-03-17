"use client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/context/WebSocketContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState("");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { socket } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ data: Message[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/chat/${chatId}`,
          { withCredentials: true }
        );
        setMessages(response.data.data);
        
        // Extract other user's name from first message that isn't from current user
        const otherUserMessage = response.data.data.find(msg => msg.sender.id !== userId);
        if (otherUserMessage) {
          setOtherUserName(otherUserMessage.sender.name);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, userId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinRoom", chatId);

    const handleReceiveMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
        if (message.sender.id !== userId && !otherUserName) {
          setOtherUserName(message.sender.name);
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.emit("leaveRoom", chatId);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, chatId, userId, otherUserName]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      createdAt: new Date().toISOString(),
      sender: { id: userId!, name: "You", email: "" },
      chatId: chatId,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/send-message`,
        { chatId, senderId: userId, content: newMessage },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-yellow-900/20 flex items-center">
        {otherUserName ? (
          <>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-neutral-900 font-bold">
              {otherUserName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-neutral-200">{otherUserName}</h2>
              <p className="text-xs text-neutral-400">
                {socket?.connected ? "Online" : "Offline"}
              </p>
            </div>
          </>
        ) : (
          <h2 className="font-semibold text-neutral-200">Chat</h2>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-neutral-800 text-neutral-400 text-xs px-3 py-1 rounded-full">
                  {formatDate(msgs[0].createdAt)}
                </div>
              </div>
              
              <AnimatePresence>
                {msgs.map((message, index) => {
                  const isSender = message.sender.id === userId;
                  const showSenderInfo = index === 0 || 
                    msgs[index - 1].sender.id !== message.sender.id;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md md:max-w-lg ${
                          showSenderInfo ? 'mt-2' : 'mt-1'
                        }`}
                      >
                        {showSenderInfo && !isSender && (
                          <div className="ml-2 text-xs text-neutral-400 mb-1">
                            {message.sender.name}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isSender
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-neutral-900'
                              : 'bg-neutral-800 text-neutral-200'
                          } ${
                            isSender && index > 0 && msgs[index - 1].sender.id === userId
                              ? 'rounded-tr-md'
                              : ''
                          } ${
                            !isSender && index > 0 && msgs[index - 1].sender.id !== userId
                              ? 'rounded-tl-md'
                              : ''
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                        <div
                          className={`text-xs text-neutral-500 mt-1 ${
                            isSender ? 'text-right mr-2' : 'ml-2'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-neutral-800/70 p-4 rounded-full mb-4">
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <h3 className="text-neutral-300 font-medium">No messages yet</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Send a message to start the conversation
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-yellow-900/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={messageInputRef}
            className="flex-grow px-4 py-3 bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent outline-none placeholder-neutral-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-neutral-900 hover:from-yellow-500 hover:to-yellow-400'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;