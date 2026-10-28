import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getMyChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const formattedChats = chats.map((chat) => {
      const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;
      const latestMessage = chat.messages[0] || null;

      return {
        chatId: chat.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
        },
        latestMessage: latestMessage
          ? {
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: formattedChats,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
    return;
  }
};

export const getASingleChatController = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ success: false, message: "Chat ID is required" });
    return;
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { user1Id: true, user2Id: true },
    });

    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not a participant in this chat",
      });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        email: message.sender.email,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: formattedMessages,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
    return;
  }
};

export const createChatController = async (req: Request, res: Response) => {
  const user1Id = req.userId;
  const { user2Id } = req.body;

  if (!user1Id) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!user2Id || user1Id === user2Id) {
    res.status(400).json({
      success: false,
      message: "Valid recipient user ID is required",
    });
    return;
  }

  try {
    const recipient = await prisma.user.findUnique({
      where: { id: user2Id },
      select: { id: true },
    });

    if (!recipient) {
      res.status(404).json({ success: false, message: "Recipient user not found" });
      return;
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (existingChat) {
      res.status(200).json({
        success: true,
        message: "Chat already exists",
        data: existingChat,
      });
      return;
    }

    const newChat = await prisma.chat.create({
      data: {
        user1Id,
        user2Id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: newChat,
    });
    return;
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Failed to create chat", success: false });
    return;
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  const senderId = req.userId;
  const { chatId, content } = req.body;

  if (!senderId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!chatId || !content || typeof content !== "string" || !content.trim()) {
    res.status(400).json({
      success: false,
      message: "chatId and valid content are required",
    });
    return;
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { user1Id: true, user2Id: true },
    });

    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    if (chat.user1Id !== senderId && chat.user2Id !== senderId) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not a participant in this chat",
      });
      return;
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (req.io) {
      req.io.to(chatId).emit("receiveMessage", message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
    return;
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
    return;
  }
};
