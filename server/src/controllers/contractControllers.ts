import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const fetDetailsForCreateContract = async (
  req: Request,
  res: Response
) => {
  try {
    const auctionId = req.params.auctionId;
    if (!auctionId) {
      res.status(400).json({
        success: false,
        message: "Auction ID is required.",
      });
      return;
    }

    // Find auction details
    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      select: {
        id: true,
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
      res.status(404).json({
        success: false,
        message: "Auction not found.",
      });
      return;
    }

    // Check for existing contracts for this auction
    const existingContract = await prisma.contract.findUnique({
      where: {
        auctionId: auction?.id,
      },
    });

    // If a non-pending contract exists, return its details

    if (existingContract) {
      res.status(200).json({
        success: true,
        message: "A contract already exists for this auction.",
        data: {
          contract: existingContract,
        },
      });
      return;
    }

    // If no non-pending contract exists, return winner ID and creator ID
    res.status(200).json({
      success: true,
      message: "No existing contracts found. You can create a new contract.",
      winnerId: auction.winnerId,
      creatorId: auction.creatorId,
    });
    return;
  } catch (error) {
    console.error("Error fetching details for contract creation:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

export const createContractController = async (req: Request, res: Response) => {
  const { auctionId } = req.params; // Get auctionId from URL params
  const { terms } = req.body; // Get terms from request body
  const loggedInUserId = req.userId; // Get logged-in user ID from the middleware
  if (!loggedInUserId) {
    res.status(400).json({
      success: false,
      message: "Please Login !",
    });
    return;
  }

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
      res.status(404).json({ message: "Auction not found", success: false });
      return;
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
      res.status(400).json({
        message: "This auction does not have a winner yet",
        success: false,
      });
      return;
    }

    // Step 4: Check if a contract already exists for this auction
    const existingContract = await prisma.contract.findUnique({
      where: { auctionId },
    });

    if (existingContract) {
      res.status(400).json({
        message: "A contract already exists for this auction",
        success: false,
      });
      return;
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
    return;
  } catch (error) {
    console.error("Error in createContractController:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

//For getting the single contract details
export const getSingleContractDetails = async (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;
    if (!contractId) {
      res.status(400).json({
        success: false,
        message: "Contract ID is required.",
      });
      return;
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
        status: true,
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
      res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Contract details found.",
      data: contract,
    });
    return;
  } catch (error) {
    console.error("Error in getSingleContractDetails:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

//For toggeling the Status of the contractorAccepted and institutionAccepted

export const toggleStatusController = async (req: Request, res: Response) => {
  const { contractId } = req.params;
  if (!contractId) {
    res.status(400).json({
      success: false,
      message: "Contract ID is required.",
    });
    return;
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
      res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
      return;
    }
    let updatedContract;
    if (userId === contract.institutionId) {
      // Toggle institution acceptance
      updatedContract = await prisma.contract.update({
        where: { id: contractId },
        data: { institutionAccepted: !contract.institutionAccepted },
      });
    } else if (userId === contract.contractor.userId) {
      updatedContract = await prisma.contract.update({
        where: { id: contractId },
        data: { contractorAccepted: !contract.contractorAccepted },
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this contract.",
      });
      return;
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
    res.status(200).json({
      success: true,
      message: "Contract acceptance status updated.",
      data: updatedContract,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

//Contract Status Controller
export const getContractStatusController = async (
  req: Request,
  res: Response
) => {
  const { contractId } = req.params;

  if (!contractId) {
    res.status(400).json({
      success: false,
      message: "Contract ID is required.",
    });
    return;
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
      res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contractStatus,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

//For Terminating the Status of the Contract
export const terminateContractController = async (
  req: Request,
  res: Response
) => {
  const { contractId } = req.params;
  if (!contractId) {
    res.status(400).json({
      success: false,
      message: "Contract ID is required.",
    });
    return;
  }
  try {
    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      select: {
        status: true,
        auctionId: true,
        institutionAccepted: true,
        institutionId: true,
        contractorId: true,
        contractorAccepted: true,
        contractor: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!contract) {
      res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
      return;
    }
    //Return if sttaus is already terminated
    if (contract.status === "TERMINATED") {
      res.status(400).json({
        success: false,
        message: "Contract is already terminated.",
      });
      return;
    }
    //Return if status is not accepted
    if (!contract.institutionAccepted || !contract.contractorAccepted) {
      res.status(400).json({
        success: false,
        message: "Contract is not accepted yet.",
      });
      return;
    }
    //Also if status is not ACCEPTED return saying status is not accepted
    if (contract.status !== "ACCEPTED") {
      res.status(400).json({
        success: false,
        message: "Contract is not accepted yet.",
      });
      return;
    }
    //Now we will check for loggedInUserId
    const loggedInUserId = req.userId;
    if (req.role !== "CONTRACTOR") {
      if (loggedInUserId !== contract.institutionId) {
        console.log("Institution Id", loggedInUserId);
        res.status(403).json({
          success: false,
          message: "You are not authorized to terminate this contract.",
        });
        return;
      }
    }

    //Now for the Mess Contract
    if (req.role === "CONTRACTOR") {
      if (loggedInUserId !== contract.contractor.userId) {
        console.log("Rejectedt Here");
        res.status(403).json({
          success: false,
          message: "You are not authorized to terminate this contract.",
        });
        return;
      }
    }

    //Once COntract Terminated
    //Close the Auction as well and set the status to closed
    await prisma.auction.update({
      where: { id: contract.auctionId },
      data: { isOpen: false },
    });
    //Now we will terminate the contract
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: "TERMINATED" },
    });
    res.status(200).json({
      success: true,
      message: "Contract terminated successfully.",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

// ============For Getting All Your Active Contracts============
export const getMyContractsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User Id is required.",
      });
      return;
    }
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          {
            institutionId: userId,
          },
          { contractor: { userId: userId } }, // Access userId inside contractor
        ],
      },
      select: {
        auction: {
          select: {
            title: true,
          },
        },
        id: true,
      },
    });
    res.status(200).json({
      success: true,
      message: "Contracts Fetched Successfully",
      data: contracts,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

// =============Update Terms Controller============
export const updateTermsController = async (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;
    if (!contractId) {
      res.status(400).json({
        success: false,
        message: "Contract ID is required.",
      });
      return;
    }
    const { terms } = req.body;
    if (!terms) {
      res.status(400).json({
        success: false,
        message: "Terms are required.",
      });
      return;
    }
    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      select: {
        status: true,
        contractorAccepted: true,
        institutionAccepted: true,
      },
    });
    if (!contract) {
      res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
      return;
    }
    if (
      contract.status === "TERMINATED" ||
      contract.status === "ACCEPTED" ||
      contract.status === "REJECTED"
    ) {
      res.status(400).json({
        success: false,
        message: `Contract is already ${contract.status.toLowerCase()}.`,
      });
      return;
    }
    //Now Update the Contract With the New Terms and also Reset both Acceptance to False
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        terms,
        contractorAccepted: false,
        institutionAccepted: false,
      },
    });
    res.status(200).json({
      success: true,
      message: "Contract terms updated successfully.",
      data: {
        terms,
      },
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};
