"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";

interface DMModalProps {
  recipientId: string;
}

const DMModal: React.FC<DMModalProps> = ({ recipientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const senderId = session?.user?.id;

  const handleCreateChat = async () => {
    if (!senderId) {
      toast.error("Please sign in to send messages.");
      return;
    }
    if (!recipientId) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/create-chat`,
        { user1Id: senderId, user2Id: recipientId },
        { withCredentials: true }
      );

      if (response.data.success) {
        const chatId = response.data.data?.id;
        const targetUrl = chatId ? `/chats?chatId=${chatId}` : "/chats";
        router.push(targetUrl);
      } else {
        toast.error(response.data.message || "Failed to start chat.");
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
      toast.error("Failed to start chat. Please try again.");
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
