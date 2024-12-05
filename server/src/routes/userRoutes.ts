import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  getUserController,
  updateUserController,
} from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.put("/update", isSign, updateUserController);
// ====================For Getting a Single User====================
userRoutes.get("/:id", isSign, getUserController);

export default userRoutes;
