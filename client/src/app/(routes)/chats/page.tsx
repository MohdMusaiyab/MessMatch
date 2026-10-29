"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatList from "@/app/components/chat/ChatList";
import ChatWindow from "@/app/components/chat/ChatWindow";
import { motion } from "framer-motion";

const ChatContent = () => {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chatId");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(!initialChatId);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (initialChatId) {
      setSelectedChatId(initialChatId);
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
    }
  }, [initialChatId]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
      {isMobileView && (
        <div className="bg-neutral-800 p-4 flex justify-between items-center border-b border-yellow-900/20">
          <button
            onClick={() => setShowChatList(!showChatList)}
            className="text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            {showChatList ? (
              selectedChatId ? "View Chat" : "Chats"
            ) : (
              "Back to Chats"
            )}
          </button>
          <h1 className="text-neutral-200 font-semibold">
            {selectedChatId && !showChatList ? "Chat" : "Your Conversations"}
          </h1>
          <div className="w-4"></div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {(!isMobileView || showChatList) && (
          <motion.div
            initial={{ x: isMobileView ? -300 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 lg:w-1/4 bg-neutral-900/50 border-r border-yellow-900/20 flex flex-col overflow-hidden"
          >
            <div className="hidden md:block p-4 border-b border-yellow-900/20">
              <h2 className="text-lg font-semibold text-neutral-200">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ChatList onSelectChat={handleChatSelect} selectedChatId={selectedChatId} />
            </div>
          </motion.div>
        )}

        {(!isMobileView || !showChatList) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-2/3 lg:w-3/4 flex flex-col"
          >
            {selectedChatId ? (
              <ChatWindow chatId={selectedChatId} />
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-neutral-300 bg-neutral-800/50 p-8 rounded-xl border border-yellow-900/20 max-w-md"
                >
                  <div className="text-yellow-500 text-5xl mb-4">💬</div>
                  <p className="text-lg font-semibold mb-2">
                    Select a chat to start messaging
                  </p>
                  <p className="text-sm text-neutral-400">
                    Choose a conversation from the list or start a new one
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
          <div className="w-8 h-8 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
};

export default ChatPage;
