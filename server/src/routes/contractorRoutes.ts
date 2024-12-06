import express from "express";
import {
  createMenuController,
  getSingleContractorController,
  updateProfileController,
} from "../controllers/contractorController";

import { isSign } from "../middlewares/isSign";

const contractorRoutes = express.Router();

contractorRoutes.post("/create-menu", isSign, createMenuController);
// =======For Updating the  Contractor Profile=======
contractorRoutes.post("/update-profile/:id", isSign, updateProfileController);
// ===================Routes that Dont Need Authorisation as Contractor===================

// =======For Getting a Single Contractor=======

contractorRoutes.get(":id", isSign, getSingleContractorController);
export default contractorRoutes;
