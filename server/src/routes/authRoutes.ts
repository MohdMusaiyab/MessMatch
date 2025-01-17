import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
} from "../controllers/authControllers";

const authRoutes = express.Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/forgot-password", forgotPasswordController);

export default authRoutes;
