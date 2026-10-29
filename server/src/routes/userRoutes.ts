import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  getAuctionsAndContractorsController,
  getUserController,
  getYourOwnProfileController,
  updateUserController,
} from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.put("/update", isSign, updateUserController);
userRoutes.get("/my-profile", isSign, getYourOwnProfileController);
userRoutes.get("/filters", isSign, getAuctionsAndContractorsController);
userRoutes.get("/:id", isSign, getUserController);

export default userRoutes;
