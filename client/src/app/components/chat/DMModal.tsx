"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DMModalProps {
  recipientId: string; // ID of the user you're messaging
}

const DMModal: React.FC<DMModalProps> = ({ recipientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const senderId = session?.user?.id; // Logged-in user's ID

  const handleCreateChat = async () => {
    if (!senderId || !recipientId) return;

    setIsLoading(true);

    try {
      // Call the createChatController
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/create-chat`,
        { user1Id: senderId, user2Id: recipientId },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Smooth navigation with a slight delay
        setTimeout(() => {
          router.push(`/chats`);
        }, 500); // 0.5-second delay for smoother UX
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      disabled={isLoading}
      className="px-3 py-1.5 bg-yellow-600 text-neutral-900 text-sm rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
    >
      {isLoading ? "Creating chat..." : "Message Privately"}
    </button>
  );
};

export default DMModal;