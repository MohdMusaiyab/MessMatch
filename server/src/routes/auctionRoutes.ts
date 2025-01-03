import express from "express";
import { isSign } from "../middlewares/isSign";
import {
  createAuctionController,
  deleteAuctionController,
  deleteYourBidController,
  getMyAuctionsController,
  getMyBidsController,
  getMySingleAuctionController,
  getOthersSingleAuctionController,
  placeBidController,
  updateAuctionController,
  updateYourBidController,
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
auctionRoutes.post("/place-bid/:id", isSign, placeBidController);

//For Updating the Bid if Bid is already Placed

auctionRoutes.put("/update-bid/:id", isSign, updateYourBidController);


//For Deleting Your Own Bid Which is Placed on an auction
auctionRoutes.delete("/delete-bid/:id", isSign, deleteYourBidController);

//For Getting the List of Auctions By the Mess Conrtractor
auctionRoutes.get("/my-bids",isSign,getMyBidsController);

//For Accepting the Bid of a User

//For Closign the Auction   
export default auctionRoutes;
