// socketServer.ts
import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
    
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room (chatId)
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    const { chatId, senderId, content } = data;

    // Save the message to the database using Prisma
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
    });

    // Emit the message to all users in the chat room
    io.to(chatId).emit("receiveMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 5000; // Use a different port for WebSocket server
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});