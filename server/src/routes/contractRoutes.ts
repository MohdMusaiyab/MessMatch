import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  createContractController,
  getAllMyContractsController,
  getSingleContractController,
  terminateContractController,
  updateContractController,
} from "../controllers/contractControllers";
const contractRoutes = express.Router();
// ================For Creating the Contract====================
contractRoutes.post("/create", isSign, createContractController);
// ===============For Updating the Contract==============
contractRoutes.put("/update", isSign, updateContractController);
// =================For Terminating the Contract==============
contractRoutes.delete("/terminate", isSign, terminateContractController);
// For getting all Your Contracts
contractRoutes.get("/all", isSign, getAllMyContractsController);

//For Getting a Single Contract of Yours

contractRoutes.get("/get/:id", isSign, getSingleContractController);

export default contractRoutes;
