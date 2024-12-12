import express from "express";
import {
  createMenuController,
  getFilteredContractorsController,
  getMyMenusController,
} from "../controllers/contractorController";

import { isSign } from "../middlewares/isSign";
import { isContractor } from "../middlewares/isContractor";

const contractorRoutes = express.Router();
// ===============For Creating Menus=========================
contractorRoutes.post(
  "/create-menu",
  isSign,
  isContractor,
  createMenuController
);
// ============For Getting all menus of yourself===============
contractorRoutes.get("/your-menus", isSign, isContractor, getMyMenusController);

// ===================Filter for Contractores====================

contractorRoutes.get("/", isSign, getFilteredContractorsController);
export default contractorRoutes;
