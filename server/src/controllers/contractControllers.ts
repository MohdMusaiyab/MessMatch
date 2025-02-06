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
        id:true,
        creatorId: true,
        winnerId: true,
        winner: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
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
    const existingContract = await prisma.contract.findUnique({
      where: {
        auctionId: auction?.id,
      },
    });

    // If a non-pending contract exists, return its details
    
    if (existingContract) {
      return res.status(200).json({
        success: true,
        message: "A contract already exists for this auction.",
        data: {
          contract: existingContract,
        },
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
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const createContractController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { auctionId } = req.params; // Get auctionId from URL params
  const { terms } = req.body; // Get terms from request body
  const loggedInUserId = req.userId; // Get logged-in user ID from the middleware

  try {
    // Step 1: Fetch the auction details
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      select: {
        creatorId: true, // ID of the auction creator (institution)
        winnerId: true, // ID of the winning contractor
      },
    });

    // Check if the auction exists
    if (!auction) {
      return res
        .status(404)
        .json({ message: "Auction not found", success: false });
    }

    // // Step 2: Ensure the logged-in user is the auction creator (institution)
    // if (auction.creatorId !== loggedInUserId) {
    //   return res.status(403).json({
    //     message: "You are not authorized to create a contract for this auction",
    //     success: false,
    //   });
    // }

    // Step 3: Ensure the auction has a winner
    if (!auction.winnerId) {
      return res.status(400).json({
        message: "This auction does not have a winner yet",
        success: false,
      });
    }

    // Step 4: Check if a contract already exists for this auction
    const existingContract = await prisma.contract.findUnique({
      where: { auctionId },
    });

    if (existingContract) {
      return res.status(400).json({
        message: "A contract already exists for this auction",
        success: false,
      });
    }

    // Step 5: Create the contract
    const newContract = await prisma.contract.create({
      data: {
        terms,
        auction: { connect: { id: auctionId } }, // Link to the auction
        contractor: { connect: { id: auction.winnerId } }, // Link to the winning contractor
        institution: { connect: { id: auction.creatorId } }, // Link to the institution (auction creator)
        status: "PENDING", // Default status
        contractorAccepted: false, // Default value
        institutionAccepted: false, // Default value
      },
    });

    // Step 6: Return the created contract
    res.status(201).json({
      message: "Contract created successfully",
      success: true,
      data: newContract,
    });
  } catch (error) {
    console.error("Error in createContractController:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

//For getting the single contract details
export const getSingleContractDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { contractId } = req.params;
    if (!contractId) {
      return res.status(400).json({
        success: false,
        message: "Contract ID is required.",
      });
    }
    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      select: {
        id: true,
        terms: true,
        createdAt: true,
        updatedAt: true,
        status:true,
        auction: {
          select: {
            id: true,
            title: true,
            description: true,
            isOpen: true,
          },
        },
        contractor: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contractorAccepted: true,
        institutionAccepted: true,
      },
    });
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contract details found.",
      data: contract,
    });
  } catch (error) {
    console.error("Error in getSingleContractDetails:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

//For toggeling the Status of the contractorAccepted and institutionAccepted

export const toggleStatusController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { contractId } = req.params;
  if (!contractId) {
    return res.status(400).json({
      success: false,
      message: "Contract ID is required.",
    });
  }
  const userId = req.userId;
  try {
    //Find the contract and necessary things associated with it
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        status: true,
        institutionAccepted: true,
        contractorAccepted: true,
        institutionId: true,
        contractor: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
    }
    let updatedContract;
    if (userId === contract.institutionId) {
      // Toggle institution acceptance
      console.log("User id", userId);
      console.log("Ins id", contract.institutionId);

      updatedContract = await prisma.contract.update({
        where: { id: contractId },
        data: { institutionAccepted: !contract.institutionAccepted },
      });
    } else if (userId === contract.contractor.userId) {
      console.log("User id",userId);
      console.log("Contractor id",contract.contractor.userId);
      updatedContract = await prisma.contract.update({
        where: { id: contractId },
        data: { contractorAccepted: !contract.contractorAccepted },
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this contract.",
      });
    }
    if (
      updatedContract.institutionAccepted &&
      updatedContract.contractorAccepted
    ) {
      await prisma.contract.update({
        where: { id: contractId },
        data: { status: "ACCEPTED" },
      });
    }
    //When this happens then on /contract/:contractId page , things will be changed ,show option to terminate and no update button then, till then user can have changes
    return res.status(200).json({
      success: true,
      message: "Contract acceptance status updated.",
      data: updatedContract,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};


//Contract Status Controller
export const getContractStatusController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { contractId } = req.params;
  
  if (!contractId) {
    return res.status(400).json({
      success: false,
      message: "Contract ID is required.",
    });
  }

  try {
    const contractStatus = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        status: true,
        institutionAccepted: true,
        contractorAccepted: true,
      },
    });

    if (!contractStatus) {
      return res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: contractStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};