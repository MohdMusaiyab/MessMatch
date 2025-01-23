import express from "express";
import {
  createMenuController,
  deleteYourMenuController,
  getFiltersController,
  getLatestAuctionsController,
  getLatestMenusController,
  getMyMenusController,
  getOthersSingleMenuController,
  getSingleMenuController,
  updateMenuController,
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
// ============For getting the Menu of others Signle One================//
contractorRoutes.get("/menus/:id", isSign, getOthersSingleMenuController);

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


// For fetching the latest 3 menus for any contractor dashboard
contractorRoutes.get("/dashboard-latest-menus", isSign, getLatestMenusController);
export default contractorRoutes;
