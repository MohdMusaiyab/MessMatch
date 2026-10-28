import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
} from "../controllers/authControllers";
import { authRateLimiter } from "../middlewares/rateLimiter";

const authRoutes = express.Router();

authRoutes.post("/register", authRateLimiter, registerController);
authRoutes.post("/login", authRateLimiter, loginController);
authRoutes.post("/forgot-password", authRateLimiter, forgotPasswordController);

export default authRoutes;
