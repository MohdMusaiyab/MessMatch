import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuctionSchema, CreateAuctionSchema } from "../schemas/schemas";

import { z } from "zod";
export const createAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId; // Assuming userId is set in middleware
    const role = req.role; // Assuming role is set in middleware

    // Check for user authorization
    if (!userId || !role) {
      return res.status(403).json({
        message: "You are not authorized to create an auction.",
        success: false,
      });
    }

    // Check if the user's role is authorized to create an auction
    if (!["COLLEGE", "CORPORATE", "ADMIN"].includes(role)) {
      return res.status(403).json({
        message: "You are not authorized to create an auction.",
        success: false,
      });
    }

    // Validate request body using CreateAuctionSchema
    const validatedData = CreateAuctionSchema.parse({
      creatorId: userId,
      title: req.body.title,
      description: req.body.description,
    });

    // Create the auction using validated data
    const auction = await prisma.auction.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        creatorId: validatedData.creatorId, // Directly use creatorId
      },
    });

    return res.status(201).json({
      message: "Auction created successfully.",
      success: true,
      data: auction,
    });
  } catch (error) {
    console.error(error);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ======================For getting my Own Auctions====================

export const getMyAuctionsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please Login First",
      success: false,
    });
  }
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        creatorId: userId,
      },
    });

    return res.status(200).json({
      message: "Auctions fetched successfully",
      success: true,
      data: auctions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================For Deleting an Auction of Yours====================
export const deleteAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId || !id) {
    return res.status(403).json({
      message: "Please Login First",
      success: false,
    });
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      return res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
    }
    if (auction.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this auction",
        success: false,
      });
    }
    await prisma.auction.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      message: "Auction Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================For Updating an Auction of Yours====================

export const updateAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please Login First",
      success: false,
    });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide an id",
      success: false,
    });
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      return res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
    }
    if (auction.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this auction",
        success: false,
      });
    }
    //Only Update the fileds that are not Same
    if (req.body.title !== auction.title) {
      auction.title = req.body.title;
    }
    if (req.body.description !== auction.description) {
      auction.description = req.body.description;
    }
    const updatedAuction = await prisma.auction.update({
      where: {
        id,
      },
      data: {
        title: auction.title,
        description: auction.description,
      },
    });
    return res.status(200).json({
      message: "Auction Updated Successfully",
      success: true,
      data: updatedAuction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =================For Getting a Siingle Auction of Mine=================

export const getMySingleAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please Login First",
      success: false,
    });
  }
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Please Provide an Id",
        success: false,
      });
    }
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      return res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
    }

    if (auction.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to view this auction",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Auction Fetched Successfully",
      success: true,
      data: auction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ==================For Getting Some One's Else Acution --Single====================

export const getOthersSingleAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please Login First",
      success: false,
    });
  }
  
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please Provide an Id",
      success: false,
    });
  }

  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        description: true,
        creator: {
          select: {
            id: true, // Include creator ID
            name: true,
            email: true,
          },
        },
        createdAt: true,
        bids: true, // Fetch bids to calculate the count, but do not return them in the response
      },
    });

    // Check if auction exists
    if (!auction) {
      return res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
    }

    // Calculate the number of bids on this auction
    const numberOfBids = auction.bids.length; // Count of bids

    // Return auction details without including the bids
    return res.status(200).json({
      message: "Auction Fetched Successfully",
      success: true,
      data: {
        title: auction.title,
        description: auction.description,
        createdAt: auction.createdAt,
        creator: {
          id: auction.creator.id, // Include creator ID
          name: auction.creator.name,
          email: auction.creator.email,
        },
        numberOfBids, // Return only the count of bids
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

