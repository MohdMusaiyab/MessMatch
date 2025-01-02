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
        bids: {
          select: {
            id: true,
            amount: true, // Select only the amount field
            bidderId: true, // Include bidderId to filter later
          },
        }, // Fetch bids to calculate the count, but do not return them in the response
      },
    });

    // Check if auction exists
    if (!auction) {
      return res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
    }

    // Filter bids to include only the user's bid
    const userBids = auction.bids.find((bid) => bid.bidderId === userId) as
      | { id: string; amount: number }
      | undefined;

    // Calculate the number of bids on this auction
    const totalBids = auction.bids.length;

    // Return auction details without including the bids
    return res.status(200).json({
      message: "Auction Fetched Successfully",
      success: true,
      data: {
        title: auction.title,
        description: auction.description,
        createdAt: auction.createdAt,
        creator: {
          id: auction.creator.id,
          name: auction.creator.name,
          email: auction.creator.email,
        },
        totalBids,
        userBid: userBids ? { id: userBids.id, amount: userBids.amount } : null,
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

// ==================For Placing the Bid on an Auction====================

export const placeBidController = async (
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
  const { amount } = req.body;
  if (!id) {
    return res.status(400).json({
      message: "Please Provide an Auction ID",
      success: false,
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Please Provide a Valid Bid Amount",
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
    const existingBid = await prisma.bid.findFirst({
      where: {
        auctionId: id,
        bidderId: userId,
      },
    });

    if (existingBid) {
      return res.status(400).json({
        message: "You have already placed a bid on this auction",
        success: false,
      });
    }

    const newBid = await prisma.bid.create({
      data: {
        auctionId: id,
        bidderId: userId,
        amount,
      },
    });

    return res.status(201).json({
      message: "Bid Placed Successfully",
      success: true,
      data: newBid,
    });
  } catch (error) {}
};

// ===================For Updating the Bid if Bid is already Placed====================

export const updateYourBidController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please login first",
      success: false,
    });
  }

  const { id } = req.params;
  const { amount } = req.body;

  if (!id || !amount) {
    return res.status(400).json({
      message: "Please provide all required details (id, amount)",
      success: false,
    });
  }

  try {
    // Check if the bid exists for the given user and auction
    const existingBid = await prisma.bid.findFirst({
      where: {
        auctionId: id,
        bidderId: userId,
      },
    });

    if (!existingBid) {
      return res.status(404).json({
        message: "Bid not found for this auction",
        success: false,
      });
    }

    // Update the bid with the new amount
    const updatedBid = await prisma.bid.update({
      where: {
        id: existingBid.id,
      },
      data: {
        amount,
      },
    });

    return res.status(200).json({
      message: "Bid updated successfully",
      success: true,
      data: updatedBid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ===================For Deleting Your Own Bid Controller=============

export const deleteYourBidController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      message: "Please login first",
      success: false,
    });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide the bid ID",
      success: false,
    });
  }

  try {
    // Check if the bid exists and belongs to the user
    const existingBid = await prisma.bid.findFirst({
      where: {
        id,
        bidderId: userId,
      },
    });

    if (!existingBid) {
      return res.status(404).json({
        message:
          "Bid not found or you do not have permission to delete this bid",
        success: false,
      });
    }

    // Delete the bid
    await prisma.bid.delete({
      where: {
        id: existingBid.id,
      },
    });

    return res.status(200).json({
      message: "Bid deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ============For Getting the List of Bids By the Mess Conrtractor====================
export const getMyBidsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const contractorId = req?.userId;
  if (!contractorId) {
    return res.status(403).json({
      message: "Please login first",
      success: false,
    });
  }
  try {
    const myBids = await prisma.bid.findMany({
      where: {
        bidderId: contractorId,
      },
      include: {
        auction: true, // Include auction details
      },
    });
    if (!myBids.length) {
      return res.status(404).json({
        message: "No bids found for this contractor.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Bids retrieved successfully.",
      success: true,
      data: myBids,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
