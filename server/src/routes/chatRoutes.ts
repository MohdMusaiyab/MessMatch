import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  createChatController,
  getASingleChatController,
  getMyChatsController,
  sendMessageController
} from "../controllers/chatControllers";

const chatRoutes = express.Router();

chatRoutes.get("/get-chats", isSign, getMyChatsController);

chatRoutes.get("/chat/:chatId", isSign, getASingleChatController);

chatRoutes.post("/create-chat", isSign, createChatController);

chatRoutes.post("/send-message",isSign,sendMessageController);
export default chatRoutes;
