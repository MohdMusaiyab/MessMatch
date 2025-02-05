import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";

export const isAuthorizedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const loggedInUserId = req.userId;
    const auctionId = req.params.auctionId;
    const contractId = req.params.contractId; // Assuming contractId is in params

    if (!auctionId && !contractId) {
      return res.status(400).json({
        message: "Either Auction ID or Contract ID must be provided",
        success: false,
      });
    }

    // If auctionId is provided
    if (auctionId) {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        select: {
          creatorId: true,
          winner: {
            select: {
              userId: true,
            },
          },
        },
      });

      // Check if auction exists
      if (!auction) {
        return res.status(404).json({ message: "Auction not found", success: false });
      }

      // Check if user is either the creator or the winner of the auction
      const isAuctionOwner = auction.creatorId === loggedInUserId;
      const isWinner = auction.winner?.userId === loggedInUserId;
      console.log(isAuctionOwner,isWinner)
      if (isAuctionOwner || isWinner) {
        console.log("returingn")
        return next(); // User is authorized for auction-related actions
      }
    }

    // If contractId is provided
    if (contractId) {
      console.log("Reaching here");
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        select: {
          institutionId: true,
          contractor:{
            select:{
              userId:true
            }
          }
        },
      });

      // Check if contract exists
      if (!contract) {
        return res.status(404).json({ message: "Contract not found", success: false });
      }

      // Check if user is either the contractor or the institution associated with the contract
      
      const isContractor = contract.contractor.userId === loggedInUserId;
      const isInstitution = contract.institutionId === loggedInUserId;

      if (isContractor || isInstitution) {
        return next(); // User is authorized for contract-related actions
      }
    }

    // If none of the conditions match, deny access
    return res.status(403).json({
      message: "You are not authorized to access this resource",
      success: false,
    });
  } catch (error) {
    console.error("Error in isAuthorizedUser middleware:", error);
    return res.status(500).json({ error: "Internal Server Error", success: false });
  }
};
