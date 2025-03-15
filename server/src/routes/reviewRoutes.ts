import express from "express";
import { isSign } from "../middlewares/isSign";
import { addReviewController, deleteReviewController, getAllReviewsController, updateReviewController } from "../controllers/reviewControllers";
const reviewRoutes = express.Router();

//For adding a review on a Contractor
reviewRoutes.post("/add-review/:profileId", isSign, addReviewController);

//For getting all reviews of a Contractor
reviewRoutes.get("/get-reviews/:profileId", isSign,getAllReviewsController);


//For Updatign Your Own Reviiew
reviewRoutes.put("/update-review/:reviewId", isSign, updateReviewController);

//For Deleting Your Own Review
reviewRoutes.delete("/delete-review/:reviewId", isSign, deleteReviewController);

export default reviewRoutes;
