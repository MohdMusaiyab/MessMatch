import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  getUserController,
  getYourOwnProfileController,
  updateUserController,
} from "../controllers/userControllers";


const userRoutes = express.Router();
// ================++For Updating User Profile====================
userRoutes.put("/update", isSign, updateUserController);
//============For Getting Your Own Profile====================

userRoutes.get("/my-profile", isSign, getYourOwnProfileController);
// ====================For Getting a Single User Profile====================
userRoutes.get("/:id", isSign, getUserController);

export default userRoutes;
