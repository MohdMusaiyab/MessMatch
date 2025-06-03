import { Request, Response } from "express";
import prisma from "../utils/prisma";
export const getMyChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true, // Include details of user1
        user2: true, // Include details of user2
        messages: {
          orderBy: {
            createdAt: "desc", // Get the latest message first
          },
          take: 1, // Only fetch the latest message
        },
      },
    });

    // Format the response to include the other user's details and the latest message
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

    res.status(200).send({
      success: true,
      message: "Chats fetched successfully",
      data: formattedChats,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch chats",
    });
    return;
  }
};

//For Getting a Particular Chat
export const getASingleChatController = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: true, // Include sender details
      },
      orderBy: {
        createdAt: "asc", // Order messages by creation time
      },
    });

    // Format the response to include sender details
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

    res.status(200).send({
      success: true,
      message: "Messages fetched successfully",
      data: formattedMessages,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch chats",
    });
    return;
  }
};

//For Creating a Chat
export const createChatController = async (req: Request, res: Response) => {
  const { user1Id, user2Id } = req.body;
  try {
    // Check if a chat already exists between these users
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
      }); // Return the existing chat
      return;
    }

    // Create a new chat
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

//For Sending a message
export const sendMessageController = async (req: Request, res: Response) => {
  const { chatId, senderId, content } = req.body;

  // Debugging: Log incoming request data
  console.log("Received request to send message:", {
    chatId,
    senderId,
    content,
  });

  try {
    // Validate input
    if (!chatId || !senderId || !content) {
      console.error("Validation failed: Missing required fields");
      res.status(400).json({
        success: false,
        message: "chatId, senderId, and content are required",
      });
      return;
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }, // Include sender details
      },
    });

    // Emit a WebSocket event to all clients in the chat room
    if (req.io) {
      console.log("Emitting 'receiveMessage' event to chat room:", chatId);
      req.io.to(chatId).emit("receiveMessage", message);
    } else {
      console.error("WebSocket instance (req.io) is not available");
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
