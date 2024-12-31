import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  createAuctionController,
  deleteAuctionController,
  getMyAuctionsController,
  getMySingleAuctionController,
  getOthersSingleAuctionController,
  placeBidController,
  updateAuctionController,
} from "../controllers/auctionControllers";


const auctionRoutes = express.Router();

//For  Creating an Auction By a Logged in User

auctionRoutes.post("/create", isSign, createAuctionController);

//For Getting all the auctions of my self

auctionRoutes.get("/my-auctions", isSign, getMyAuctionsController);

//For Deleting an Auction of Yours
auctionRoutes.delete("/delete/:id", isSign, deleteAuctionController);

//For Getting a single Auction of YourSelf mainly used for before updating
auctionRoutes.get("/get/:id", isSign, getMySingleAuctionController);

//For Updating an Auction of Yours
auctionRoutes.put("/update/:id", isSign, updateAuctionController);

//For getting a single Auction of Other's
auctionRoutes.get("/get-auction/:id", isSign, getOthersSingleAuctionController);

//For Placing the Bid on an Auction
auctionRoutes.post("/place-bid/:id",isSign,placeBidController);

export default auctionRoutes;
