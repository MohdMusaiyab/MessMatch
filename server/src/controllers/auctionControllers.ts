import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateAuctionSchema } from "../schemas/schemas";

import { z } from "zod";
export const createAuctionController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Assuming userId is set in middleware
    const role = req.role; // Assuming role is set in middleware

    // Check for user authorization
    if (!userId || !role) {
      res.status(403).json({
        message: "You are not authorized to create an auction.",
        success: false,
      });
      return;
    }

    // Check if the user's role is authorized to create an auction
    if (!["COLLEGE", "CORPORATE", "ADMIN"].includes(role)) {
      res.status(403).json({
        message: "You are not authorized to create an auction.",
        success: false,
      });
      return;
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
        creatorId: validatedData.creatorId, // Using creatorId
      },
    });

    res.status(201).json({
      message: "Auction created successfully.",
      success: true,
      data: auction,
    });
    return;
  } catch (error) {
    console.error(error);

    // Handling Zod validation errors specifically
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        success: false,
      });
      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// ======================For getting my Own Auctions====================

export const getMyAuctionsController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
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

    res.status(200).json({
      message: "Auctions fetched successfully",
      success: true,
      data: auctions,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// =====================For Deleting/ an Auction of Yours====================
export const deleteAuctionController = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId || !id) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }
    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to delete this auction",
        success: false,
      });
      return;
    }
    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isOpen: false,
      },
    });
    res.status(200).json({
      message: "Auction Deleted Successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// =====================For Updating an Auction of Yours====================

export const updateAuctionController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "Please provide an id",
      success: false,
    });
    return;
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }
    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to update this auction",
        success: false,
      });
      return;
    }
    //Also Cannot Update Auction When Contract Exists
    const existingContract = await prisma.contract.findMany({
      where: {
        auctionId: id,
      },
    });
    if (existingContract.length > 0) {
      res.status(400).json({
        message:
          "Cannot Update this Auction as Contract Exists for this Auction",
        success: false,
      });
      return;
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
    res.status(200).json({
      message: "Auction Updated Successfully",
      success: true,
      data: updatedAuction,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// =================For Getting a Siingle Auction of Mine=================

export const getMySingleAuctionController = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Please Provide an Auction Id",
        success: false,
      });
      return;
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
        contract: {
          // Include the contract relation
          select: {
            id: true, // Include the contract ID
            // Add other contract fields you need here
            status: true,
          },
        },
      },
    });

    if (!auction) {
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }

    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to view this auction",
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: "Auction Fetched Successfully",
      success: true,
      data: auction,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// ==================For Getting Some One's Else Acution --Single====================

export const getOthersSingleAuctionController = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Please Provide an Auction Id",
      success: false,
    });
    return;
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
            contactNumber: true,
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
            id: true,
            contractorAccepted: true,
            institutionAccepted: true,
          },
        },
      },
    });

    // Check if auction exists
    if (!auction) {
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }

    // Filter bids to include only the user's bid

    // Calculate the number of bids on this auction
    const totalBids = auction._count.bids; // Total number of bids

    // Return auction details without including the bids
    res.status(200).json({
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
          contactNumber: auction.creator.contactNumber,
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
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// ==================For Placing the Bid on an Auction====================

export const placeBidController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }
  const { id } = req.params;
  const { amount } = req.body;
  if (!id) {
    res.status(400).json({
      message: "Please Provide an Auction ID",
      success: false,
    });
    return;
  }

  if (!amount || amount <= 0) {
    res.status(400).json({
      message: "Please Provide a Valid Bid Amount",
      success: false,
    });
    return;
  }
  try {
    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },
    });
    if (!auction) {
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }
    if (auction?.isOpen === false) {
      res.status(400).json({
        message: "Auction is Closed",
        success: false,
      });
      return;
    }
    const existingBid = await prisma.bid.findFirst({
      where: {
        auctionId: id,
        bidderId: userId,
      },
    });

    if (existingBid) {
      res.status(400).json({
        message: "You have already placed a bid on this auction",
        success: false,
      });
      return;
    }

    const newBid = await prisma.bid.create({
      data: {
        auctionId: id,
        bidderId: userId,
        amount,
      },
    });

    res.status(201).json({
      message: "Bid Placed Successfully",
      success: true,
      data: newBid,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    return;
  }
};

// ===================For Updating the Bid if Bid is already Placed====================

export const updateYourBidController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please login first",
      success: false,
    });
    return;
  }
  //Getting the Auction id
  const { id } = req.params;
  const { amount } = req.body;

  if (!id || !amount) {
    res.status(400).json({
      message: "Please provide all required details (id, amount)",
      success: false,
    });
    return;
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
      res.status(404).json({
        message: "Bid not found for this auction",
        success: false,
      });
      return;
    }
    if (existingBid.auction.isOpen === false) {
      res.status(400).json({
        message: "Cannot Update Bid! Auction is Closed",
        success: false,
      });
      return;
    }
    //Also Check if Contract Does not Exist for this Auction
    const isExistingContract = await prisma.contract.findUnique({
      where: {
        auctionId: id,
      },
    });
    if (isExistingContract) {
      res.status(400).json({
        message: "Cannot Update this Bid as a Contract Exists for this Auction",
        success: false,
      });
      return;
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

    res.status(200).json({
      message: "Bid updated successfully",
      success: true,
      data: updatedBid,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

// ===================For Deleting Your Own Bid Controller=============
//Remeber to Delete the Contract if Any, Winner if Any, and also winner Id and other things

export const deleteYourBidController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please login first",
      success: false,
    });
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Please provide the Auction ID",
      success: false,
    });
    return;
  }

  try {
    // Check if the bid exists and belongs to the user
    const existingBid = await prisma.bid.findFirst({
      where: {
        auctionId: id,
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
      res.status(404).json({
        message:
          "Bid not found or you do not have permission to delete this bid",
        success: false,
      });
      return;
    }
    if (existingBid.auction.isOpen === false) {
      res.status(400).json({
        message: "Auction is Closed",
        success: false,
      });
      return;
    }
    //Handlng the Case if the Bidder is Winner
    //Alos Handle the Case where Bid is to be deleted and so is the Contract assoicated with it if any
    if (existingBid.auction.winnerId === userId) {
      await prisma.auction.update({
        where: { id: existingBid.auction.id },
        data: { winnerId: null },
      });
    }
    //Also Check if the Contract Exists for this Auction
    const contract = await prisma.contract.findUnique({
      where: {
        auctionId: existingBid.auction.id,
      },
    });
    if (contract) {
      // If a contract exists, delete it
      await prisma.contract.delete({
        where: {
          auctionId: existingBid.auction.id,
        },
      });
    }

    //Alos Handle the Case where Bid is to be deleted and so is the Contract assoicated with it if any
    // Delete the bid
    await prisma.bid.delete({
      where: {
        id: existingBid.id,
      },
    });

    res.status(200).json({
      message: "Bid deleted successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

// ============For Getting the List of Bids By the Mess Conrtractor====================
export const getMyBidsController = async (req: Request, res: Response) => {
  const contractorId = req?.userId;
  if (!contractorId) {
    res.status(403).json({
      message: "Please login first",
      success: false,
    });
    return;
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
      res.status(404).json({
        message: "You Have Not Placed any bid till now.",
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: "Bids retrieved successfully.",
      success: true,
      data: myBids,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

// ===============For Opeing the Auction Again===================

export const openAuctionController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please Login First",
    });
    return;
  }
  const { id } = req?.params;
  if (!id) {
    res.status(400).json({
      message: "Please provide an auction ID",
      success: false,
    });
    return;
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
      res.status(404).json({
        message: "Auction not found",
        success: false,
      });
      return;
    }

    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to open this auction",
        success: false,
      });
      return;
    }
    //Check if any contract exists or not for it
    const contract = await prisma.contract.findUnique({
      where: {
        auctionId: id,
      },
    });
    if (contract) {
      res.status(400).json({
        message: "Cannot Open this Auction as Contract Exists for this Auction",
        success: false,
      });
      return;
    }
    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isOpen: true,
      },
    });

    res.status(200).json({
      message: "Auction opened successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

// ===========For Accepting the Bid of a User=============

export const acceptBidAcontroller = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { auctionId, bidId } = req.body;

    if (!userId) {
      res.status(403).json({
        message: "Please login first",
        success: false,
      });
      return;
    }

    if (!auctionId || !bidId) {
      res.status(400).json({
        message: "Please provide auction ID and bid ID",
        success: false,
      });
      return;
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
      res.status(404).json({
        message: "Auction not found",
        success: false,
      });
      return;
    }

    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to accept bids for this auction",
        success: false,
      });
      return;
    }
    //Can Make Winner even if its closed
    // if (!auction.isOpen) {
    //   return res.status(400).json({
    //     message: "Auction is closed",
    //     success: false,
    //   });
    // }

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
      res.status(404).json({
        message: "Bid not found for this auction",
        success: false,
      });
      return;
    }

    //Find the Contractor associated with the Bid
    const contractor = await prisma.messContractor.findUnique({
      where: {
        userId: bid.bidderId,
      },
    });

    if (!contractor) {
      res.status(404).json({
        message: "Contractor not found",
        success: false,
      });
      return;
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

    res.status(200).json({
      message: "Bid accepted successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

// ============For Removing the Bid as Winnner================
export const removeWinnerController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Please Login First",
      success: false,
    });
    return;
  }

  try {
    const { auctionId } = req.body;

    if (!auctionId) {
      res.status(400).json({
        message: "Please provide auction ID ",
        success: false,
      });
      return;
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
      res.status(404).json({
        message: "Auction Not Found",
        success: false,
      });
      return;
    }
    if (auction.creatorId !== userId) {
      res.status(403).json({
        message: "You are not authorized to accept bids for this auction",
        success: false,
      });
      return;
    }

    //First Check if that auction had some winner or not
    if (!auction.winnerId) {
      res.status(400).json({
        message: "No Winner Found",
        success: false,
      });
      return;
    }
    //Also Find the Contract Associated with this Auction
    const contract = await prisma.contract.findUnique({
      where: {
        auctionId: auctionId,
      },
    });

    if (contract) {
      // If a contract exists, delete it
      await prisma.contract.delete({
        where: {
          auctionId: auctionId,
        },
      });
    }
    await prisma.auction.update({
      where: {
        id: auctionId,
      },
      data: {
        winnerId: null,
      },
    });

    res.status(200).json({
      message: "Winner Removed Successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};
