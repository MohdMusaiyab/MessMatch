import { Request, Response } from "express";
import prisma from "../utils/prisma";

//For Adding a Review
export const addReviewController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }
    const { profileId } = req.params;
    if (!profileId) {
      res
        .status(400)
        .json({ message: "Profile ID is required", success: false });
      return;
    }
    const { rating, comment } = req.body;
    if (!rating) {
      res.status(400).json({ message: "Rating is required", success: false });
      return;
    }
    if (rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ message: "Rating must be between 1 and 5", success: false });
      return;
    }
    if (!comment) {
      res.status(400).json({ message: "Comment is required", success: false });
      return;
    }
    const contractor = await prisma.messContractor.findFirst({
      where: {
        userId: profileId,
      },
      select: {
        id: true,
      },
    });
    if (!contractor) {
      res.status(400).json({ message: "Contractor Not Found", success: false });
      return;
    }
    //Now we will check if the user has already reviewed the contractor
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: userId,
        contractorId: contractor.id,
      },
    });
    if (existingReview) {
      res.status(400).json({
        message: "You have already reviewed this contractor",
        success: false,
      });
      return;
    }
    //Now we will add the review
    //First find the contractor ID associated with the profile ID

    const review = await prisma.review.create({
      data: {
        reviewerId: userId,
        contractorId: contractor.id,
        rating,
        comment,
      },
    });
    res.status(201).json({
      message: "Reveiw Added Successfully",
      success: true,
      data: review,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

//For Getting all reviews of a Contractor
export const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    if (!profileId) {
      res
        .status(400)
        .json({ message: "Profile ID is required", success: false });
      return;
    }
    const contractor = await prisma.messContractor.findUnique({
      where: {
        userId: profileId,
      },
    });
    if (!contractor) {
      res.status(400).json({ message: "Contractor Not Found", success: false });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: {
        contractorId: contractor.id,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json({
      message: "Reviews Fetched Successfully",
      success: true,
      data: reviews,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

//For Updating Your Own Review
export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      res
        .status(400)
        .json({ message: "Review ID is required", success: false });
      return;
    }
    //Find the review with reveiwer Id included
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.userId,
      },
    });
    if (!review) {
      res.status(400).json({ message: "Review Not Found", success: false });
      return;
    }
    const { rating, comment } = req.body;
    if (!rating) {
      res.status(400).json({ message: "Rating is required", success: false });
      return;
    }
    if (rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ message: "Rating must be between 1 and 5", success: false });
      return;
    }
    if (!comment) {
      res.status(400).json({ message: "Comment is required", success: false });
      return;
    }
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating,
        comment,
      },
    });
    res.status(200).json({
      message: "Review Updated Successfully",
      success: true,
      data: updatedReview,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

//////////////For Deleting A reveiw
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      res
        .status(400)
        .json({ message: "Review ID is required", success: false });
      return;
    }
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.userId,
      },
    });
    if (!review) {
      res.status(400).json({ message: "Review Not Found", success: false });
      return;
    }
    if (review.reviewerId !== req.userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
    res.status(200).json({
      message: "Review Deleted Successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};
