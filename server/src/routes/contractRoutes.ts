import express from "express";
import { isAuthorizedUser } from "../middlewares/isAuthorizedUser";
import { isSign } from "../middlewares/isSign";
import { fetDetailsForCreateContract,createContractController, getSingleContractDetails, toggleStatusController, getContractStatusController } from "../controllers/contractControllers";
export const contractRoutes = express.Router();

//Basic Route for Gettign Details During Create
contractRoutes.get("/:auctionId",isSign,isAuthorizedUser,fetDetailsForCreateContract);

//For Creating the Contract
contractRoutes.post("/create-contract/:auctionId",isSign,isAuthorizedUser,createContractController);

// For Acesssing all the necessary information regarding the contract
contractRoutes.get("/get-contract/:contractId",isSign,isAuthorizedUser,getSingleContractDetails);

//For toggling to Status of the Acceptacne and Also Changing the Status
contractRoutes.put("/toggle-status/:contractId",isSign,isAuthorizedUser,toggleStatusController);

//For Getting the Status and Acceptance 
contractRoutes.get("/status/:contractId", isSign, isAuthorizedUser, getContractStatusController);

export default contractRoutes;
