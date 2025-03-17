"use client";
import { useState } from "react";
import ChatList from "@/app/components/chat/ChatList";
import ChatWindow from "@/app/components/chat/ChatWindow";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <ChatList onSelectChat={setSelectedChatId} />
      </div>
      <div style={{ width: "70%" }}>
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} />
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Select a chat to start messaging
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
