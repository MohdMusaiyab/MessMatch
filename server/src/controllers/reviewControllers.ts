import { Request, Response } from "express";
import prisma from "../utils/prisma";

//For Adding a Review
export const addReviewController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { profileId } = req.params;
    if (!profileId) {
      return res
        .status(400)
        .json({ message: "Profile ID is required", success: false });
    }
    const { rating, comment } = req.body;
    if (!rating) {
      return res
        .status(400)
        .json({ message: "Rating is required", success: false });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5", success: false });
    }
    if (!comment) {
      return res
        .status(400)
        .json({ message: "Comment is required", success: false });
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
      return res
        .status(400)
        .json({ message: "Contractor Not Found", success: false });
    }
    //Now we will check if the user has already reviewed the contractor
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: userId,
        contractorId: contractor.id,
      },
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this contractor",
        success: false,
      });
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
    return res.status(201).json({
      message: "Reveiw Added Successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//For Getting all reviews of a Contractor
export const getAllReviewsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { profileId } = req.params;
    if (!profileId) {
      return res
        .status(400)
        .json({ message: "Profile ID is required", success: false });
    }
    const contractor = await prisma.messContractor.findUnique({
      where: {
        userId: profileId,
      },
    });
    if (!contractor) {
      return res
        .status(400)
        .json({ message: "Contractor Not Found", success: false });
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
    return res.status(200).json({
      message: "Reviews Fetched Successfully",
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//For Updating Your Own Review
export const updateReviewController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      return res
        .status(400)
        .json({ message: "Review ID is required", success: false });
    }
    //Find the review with reveiwer Id included
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.userId,
      },
    });
    if (!review) {
      return res
        .status(400)
        .json({ message: "Review Not Found", success: false });
    }
    const { rating, comment } = req.body;
    if (!rating) {
      return res
        .status(400)
        .json({ message: "Rating is required", success: false });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5", success: false });
    }
    if (!comment) {
      return res
        .status(400)
        .json({ message: "Comment is required", success: false });
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
    return res.status(200).json({
      message: "Review Updated Successfully",
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//////////////For Deleting A reveiw
export const deleteReviewController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      return res
        .status(400)
        .json({ message: "Review ID is required", success: false });
    }
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.userId,
      },
    });
    if (!review) {
      return res
        .status(400)
        .json({ message: "Review Not Found", success: false });
    }
    if (review.reviewerId !== req.userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
    return res.status(200).json({
      message: "Review Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
