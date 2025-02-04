import express from "express";
import { isAuthorizedUser } from "../middlewares/isAuthorizedUser";
import { isSign } from "../middlewares/isSign";
import { fetDetailsForCreateContract } from "../controllers/contractControllers";
export const contractRoutes = express.Router();
//Basic Route for Gettign Details During Create
contractRoutes.get("/:auctionId",isSign,fetDetailsForCreateContract);
export default contractRoutes;
