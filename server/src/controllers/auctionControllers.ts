import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateAuctionSchema } from "../schemas/schemas";

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
      isOpen: true,
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
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        isOpen: true,
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

// =====================For Deleting/ an Auction of Yours====================
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
    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isOpen: false,
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
      select: {
        id: true,
        title: true,
        description: true,
        isOpen: true,
        winner: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        createdAt: true,
        bids: {
          select: {
            id: true,
            amount: true,
            bidder: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        creatorId: true,
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
        isOpen: true,
        creator: {
          select: {
            id: true, // Include creator ID
            name: true,
            email: true,
          },
        },
        createdAt: true,
        bids: {
          where: {
            bidderId: userId,
          },
          select: {
            id: true,
            amount: true, // Select only the amount field
          },
        },
        _count: {
          select: { bids: true }, // Count all bids on this auction
        },
        winner: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        },
        contract: {
          select: {
            contractorAccepted: true,
            institutionAccepted: true,
          },
        },
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

    // Calculate the number of bids on this auction
    const totalBids = auction._count.bids; // Total number of bids

    // Return auction details without including the bids
    return res.status(200).json({
      message: "Auction Fetched Successfully",
      success: true,
      data: {
        title: auction.title,
        description: auction.description,
        createdAt: auction.createdAt,
        isOpen: auction.isOpen,
        creator: {
          id: auction.creator.id,
          name: auction.creator.name,
          email: auction.creator.email,
        },
        totalBids,
        userBid: auction.bids[0] || null, // Return the user's bid if available
        winner: auction.winner
          ? {
              id: auction.winner.user.id,
              name: auction.winner.user.name,
              email: auction.winner.user.email,
            }
          : null,
        contract: auction.contract,
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
    if (auction?.isOpen === false) {
      return res.status(400).json({
        message: "Auction is Closed",
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
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
      select: {
        id: true,
        amount: true,
        bidderId: true,
        auction: {
          select: {
            isOpen: true,
          },
        },
      },
    });

    if (!existingBid) {
      return res.status(404).json({
        message: "Bid not found for this auction",
        success: false,
      });
    }
    if (existingBid.auction.isOpen === false) {
      return res.status(400).json({
        message: "Auction is Closed",
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
      select: {
        id: true,
        auction: {
          select: {
            id: true,
            isOpen: true,
            winnerId: true,
          },
        },
      },
    });

    if (!existingBid) {
      return res.status(404).json({
        message:
          "Bid not found or you do not have permission to delete this bid",
        success: false,
      });
    }
    if (existingBid.auction.isOpen === false) {
      return res.status(400).json({
        message: "Auction is Closed",
        success: false,
      });
    }
    //Handlng the Case if the Bidder is Winner
    //Alos Handle the Case where Bid is to be deleted and so is the Contract assoicated with it if any
    if (existingBid.auction.winnerId === userId) {
      await prisma.auction.update({
        where: { id: existingBid.auction.id },
        data: { winnerId: null },
      });
    }

    //Alos Handle the Case where Bid is to be deleted and so is the Contract assoicated with it if any
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
        auction: {
          select: {
            id: true,
            title: true,
            description: true,
            winnerId: true, // Include winnerId from auction
          },
        },
      },
    });

    if (!myBids.length) {
      return res.status(404).json({
        message: "You Have Not Placed any bid till now.",
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

// ===============For Opeing the Auction Again===================

export const openAuctionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({
      success: false,
      message: "Please Login First",
    });
  }
  const { id } = req?.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide an auction ID",
      success: false,
    });
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
      select: {
        creatorId: true,
      },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
        success: false,
      });
    }

    if (auction.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to open this auction",
        success: false,
      });
    }

    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isOpen: true,
      },
    });

    return res.status(200).json({
      message: "Auction opened successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ===========For Accepting the Bid of a User=============

export const acceptBidAcontroller = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const { auctionId, bidId } = req.body;

    if (!userId) {
      return res.status(403).json({
        message: "Please login first",
        success: false,
      });
    }

    if (!auctionId || !bidId) {
      return res.status(400).json({
        message: "Please provide auction ID and bid ID",
        success: false,
      });
    }

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      select: {
        creatorId: true,
        isOpen: true,
      },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
        success: false,
      });
    }

    if (auction.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to accept bids for this auction",
        success: false,
      });
    }

    if (!auction.isOpen) {
      return res.status(400).json({
        message: "Auction is closed",
        success: false,
      });
    }

    const bid = await prisma.bid.findUnique({
      where: {
        id: bidId,
      },
      select: {
        auctionId: true,
        bidderId: true,
      },
    });

    if (!bid || bid.auctionId !== auctionId) {
      return res.status(404).json({
        message: "Bid not found for this auction",
        success: false,
      });
    }

    //Find the Contractor associated with the Bid
    const contractor = await prisma.messContractor.findUnique({
      where: {
        userId: bid.bidderId,
      },
    });

    if (!contractor) {
      return res.status(404).json({
        message: "Contractor not found",
        success: false,
      });
    }
    await prisma.auction.update({
      where: {
        id: auctionId,
      },
      data: {
        isOpen: false,
        winnerId: contractor.id,
      },
    });

    return res.status(200).json({
      message: "Bid accepted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ============For Removing the Bid as Winnner================
export const removeWinnerController = async (
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
    const { auctionId } = req.body;

    if (!auctionId) {
      return res.status(400).json({
        message: "Please provide auction ID ",
        success: false,
      });
    }
    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      select: {
        creatorId: true,
        winnerId: true,
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
        message: "You are not authorized to accept bids for this auction",
        success: false,
      });
    }

    //First Check if that auction had some winner or not
    if (!auction.winnerId) {
      return res.status(400).json({
        message: "No Winner Found",
        success: false,
      });
    }
    //Now Remove the Winner
    await prisma.auction.update({
      where: {
        id: auctionId,
      },
      data: {
        winnerId: null,
      },
    });
    return res.status(200).json({
      message: "Winner Removed Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
