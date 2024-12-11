import express from "express";
import {
  createMenuController,
  getFilteredContractorsController,
  getSingleContractorController,
} from "../controllers/contractorController";

import { isSign } from "../middlewares/isSign";
import { isContractor } from "../middlewares/isContractor";

const contractorRoutes = express.Router();

contractorRoutes.post(
  "/create-menu",
  isSign,
  isContractor,
  createMenuController
);

// =======For Getting a Single Contractor=======
// =================No Need to check if the user is Contractor or not=================
contractorRoutes.get("/:id", isSign, getSingleContractorController);
export default contractorRoutes;

// ===================Filter for Contractores====================

contractorRoutes.get("/", isSign, getFilteredContractorsController);
