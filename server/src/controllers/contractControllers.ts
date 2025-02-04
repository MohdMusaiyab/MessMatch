import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const fetDetailsForCreateContract = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const auctionId = req.params.auctionId;
    if (!auctionId) {
      return res.status(400).json({
        success: false,
        message: "Auction ID is required.",
      });
    }

    // Find auction details
    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      select: {
        creatorId: true,
        winnerId: true,
      },
    });

    // Check if auction exists
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found.",
      });
    }

    // Check for existing contracts for this auction
    const existingContract = await prisma.contract.findFirst({
      where: {
        auctionId: auctionId,
        NOT: {
          status: 'PENDING', // Assuming 'PENDING' is a valid status in your Contract model
        },
      },
    });

    // If a non-pending contract exists, return its details
    if (existingContract) {
      return res.status(200).json({
        success: true,
        message: "A contract already exists for this auction.",
        auctionId,
      });
    }

    // If no non-pending contract exists, return winner ID and creator ID
    return res.status(200).json({
      success: true,
      message: "No existing contracts found. You can create a new contract.",
      winnerId: auction.winnerId,
      creatorId: auction.creatorId,
    });
  } catch (error) {
    console.error("Error fetching details for contract creation:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
