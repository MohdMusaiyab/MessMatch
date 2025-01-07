import express from "express";
import {
  createMenuController,
  deleteYourMenuController,
  getFiltersController,
  getLatestAuctionsController,
  getMyMenusController,
  getOthersMenuController,
  getSingleMenuController,
  updateMenuController,
} from "../controllers/contractorController";

import { isSign } from "../middlewares/isSign";
import { isContractor } from "../middlewares/isContractor";
import { format } from "node:path/win32";

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
// ============For getting the Menu of others================//
contractorRoutes.get("/menus/:id", isSign, getOthersMenuController);

//For Getting a single Menu using its ID================//
contractorRoutes.get("/menu/:id", isSign, getSingleMenuController);
//=================For Updating A Menu using its ID================//
contractorRoutes.put(
  "/update-menu/:id",
  isSign,
  isContractor,
  updateMenuController
);

// ================For Deleting your own Menu======================
contractorRoutes.delete(
  "/delete-menu/:id",
  isSign,
  isContractor,
  deleteYourMenuController
);

// ===================Filter for Contractores====================
//This below code needs checking

contractorRoutes.get("/filters",isSign,getFiltersController);

// ==========For Getting Latest 3 Auctions where he had Placedd Bid + 3 of hi latets Menu's==========

 contractorRoutes.get("/latest-things",isSign,isContractor,getLatestAuctionsController);
export default contractorRoutes;
