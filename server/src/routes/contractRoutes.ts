import express from "express";
import { isAuthorizedUser } from "../middlewares/isAuthorizedUser";
import { isSign } from "../middlewares/isSign";
import { fetDetailsForCreateContract,createContractController, getSingleContractDetails } from "../controllers/contractControllers";
export const contractRoutes = express.Router();

//Basic Route for Gettign Details During Create
contractRoutes.get("/:auctionId",isSign,isAuthorizedUser,fetDetailsForCreateContract);

//For Creating the Contract
contractRoutes.post("/create-contract/:auctionId",isSign,isAuthorizedUser,createContractController);

// For Acesssing all the necessary information regarding the contract
contractRoutes.get("/get-contract/:contractId",isSign,isAuthorizedUser,getSingleContractDetails);


export default contractRoutes;
