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
import jwt from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: [],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.set("trust proxy", 1);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return next(new Error("Server secret not configured"));
    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
      email: string;
    };
    socket.data.userId = decoded.id;
    socket.data.role = decoded.role;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

app.use(bodyparser.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/user`, userRoutes);
app.use(`${process.env.BASE_URL}/contractor`, contractorRoutes);
app.use(`${process.env.BASE_URL}/auction`, auctionRoutes);
app.use(`${process.env.BASE_URL}/contract`, contractRoutes);
app.use(`${process.env.BASE_URL}/review`, reviewRoutes);
app.use(`${process.env.BASE_URL}/chat`, chatRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { chatId, senderId, content } = data;

    try {
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId,
          content,
        },
        include: {
          sender: true,
        },
      });

      io.to(chatId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT: number = parseInt(process.env.PORT || "4000", 10);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
