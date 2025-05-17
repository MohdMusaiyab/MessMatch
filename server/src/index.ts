import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import contractorRoutes from "./routes/contractorRoutes";
import auctionRoutes from "./routes/auctionRoutes";
import contractRoutes from "./routes/contractRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
const server = http.createServer(app); // Create an HTTP server
``;
// Configure CORS for Express
// In your backend (index.ts)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
};
app.set("trust proxy", 1);
app.use(cors(corsOptions));

// Initialize WebSocket server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
});

app.use(bodyparser.json());
app.use(cookieParser()); // Add cookie-parser middleware

// Attach io to the request object
app.use((req: Request, res: Response, next: NextFunction) => {
  req.io = io; // Now TypeScript recognizes the io property
  next();
});

// Routes
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/user`, userRoutes);
app.use(`${process.env.BASE_URL}/contractor`, contractorRoutes);
app.use(`${process.env.BASE_URL}/auction`, auctionRoutes);
app.use(`${process.env.BASE_URL}/contract`, contractRoutes);
app.use(`${process.env.BASE_URL}/review`, reviewRoutes);
app.use(`${process.env.BASE_URL}/chat`, chatRoutes);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room (chatId)
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Leave a room (chatId)
  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  // Handle sending messages via WebSocket
  socket.on("sendMessage", async (data) => {
    const { chatId, senderId, content } = data;

    try {
      // Save the message to the database using Prisma
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId,
          content,
        },
        include: {
          sender: true, // Include sender details
        },
      });

      // Emit the message to all users in the chat room
      io.to(chatId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT: number = parseInt(process.env.PORT || "4000", 10);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
