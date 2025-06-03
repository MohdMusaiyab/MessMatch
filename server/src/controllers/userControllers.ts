import { Request, Response } from "express";
import { ZodError } from "zod";
import { hashPassword } from "../utils/auth";
import prisma from "../utils/prisma";
import { Prisma, State } from "@prisma/client";

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const userRole = req.role; // Extract role from the request
    const {
      name,
      email,
      password,
      state,
      address,
      contactNumber,
      securityQuestion,
      securityAnswer,
      contractorFields, // For contractor-specific fields
    } = req.body;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contractor: true }, // Include contractor if they exist
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    // Prepare the update object for the User table
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (state) updateData.state = state;
    if (address) updateData.address = address;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (password) updateData.password = await hashPassword(password); // Hashing the password
    if (securityQuestion) updateData.securityQuestion = securityQuestion;
    if (securityAnswer)
      updateData.securityAnswer = await hashPassword(securityAnswer);

    // Role-based additional updates
    if (userRole === "CONTRACTOR" && contractorFields) {
      const { numberOfPeople, services } = contractorFields;

      // Ensure contractor record exists
      if (!user.contractor) {
        res.status(400).json({
          message: "Contractor record not found for this user",
          success: false,
        });
        return;
      }

      // Update contractor-specific fields
      await prisma.messContractor.update({
        where: { userId: userId },
        data: {
          numberOfPeople:
            parseInt(numberOfPeople) ?? user.contractor.numberOfPeople,
          services: services ?? user.contractor.services,
          updatedAt: new Date(),
        },
      });
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
    return;
  } catch (error) {
    console.error(error);

    // Handle Zod validation errors specifically
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation error",
        success: false,
        errors: error.errors,
      });
      return;
    }

    // Generic error handling
    res.status(500).json({
      message: "Error in updating user",
      success: false,
    });
    return;
  }
};
// ====================For Getting a Single User Profile====================
export const getUserController = async (req: Request, res: Response) => {
  const userId = req.userId; // The ID of the currently authenticated user
  if (!userId) {
    res.status(401).json({
      // Changed to 401 Unauthorized
      message: "Unauthorized access",
      success: false,
    });
    return;
  }

  const { id } = req.params; // The ID of the user being requested
  if (!id) {
    res.status(400).json({
      message: "User ID not provided",
      success: false,
    });
    return;
  }

  try {
    // Fetch the user and check if they are a contractor
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        state: true,
        contactNumber: true,
        role: true,
        contractor: {
          // Include contractor relation
          select: {
            numberOfPeople: true,
            services: true,
            menus: {
              // Fetch menus if they exist
              select: {
                id: true,
                name: true,
                pricePerHead: true,
                type: true,
                items: true,
              },
            },
          },
        },
        auctionsCreated: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    // Prepare response data
    const responseData = {
      ...user, // Spread existing user data
      contractorDetails: user.role === "CONTRACTOR" ? user.contractor : null, // Add contractor details if applicable
    };

    res.status(200).json({
      message: "User found",
      success: true,
      data: responseData,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in getting user",
      success: false,
    });
    return;
  }
};

// ==============================For Getting Your Own Profile====================
//Need Edits
export const getYourOwnProfileController = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({
      message: "User not found",
      success: false,
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        state: true,
        securityQuestion: true,
        contactNumber: true,
        role: true,
        contractor: {
          select: {
            numberOfPeople: true,
            services: true,
            menus: {
              select: {
                id: true,
                name: true,
                pricePerHead: true,
                type: true,
                items: true,
              },
            },
          },
        },
        auctionsCreated: {
          select: {
            id: true,
            title: true,
            description: true,
            bids: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: "User found",
      success: true,
      data: user,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in getting user",
      success: false,
    });
    return;
  }
};

// ================For Filtering the Users + Acution=====================

export const getAuctionsAndContractorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      maxBids,
      auctionStatus, // 'open' or 'closed'
      state, // Add state query parameter
    } = req.query;

    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    // Initialize filters array for auctions
    const auctionFilters: Prisma.AuctionWhereInput[] = [];

    // Search filter for auctions
    if (search) {
      auctionFilters.push({
        title: {
          contains: search as string,
          mode: "insensitive",
        },
      });
    }

    // Auction status filter
    if (auctionStatus === "open") {
      auctionFilters.push({
        isOpen: true,
      });
    } else if (auctionStatus === "closed") {
      auctionFilters.push({
        isOpen: false,
      });
    }

    // State filter for auctions (based on creator's state)
    if (state) {
      auctionFilters.push({
        creator: {
          state: state as State, // Filter by creator's state
        },
      });
    }

    // Combine conditions for auctions
    const auctionWhere =
      auctionFilters.length > 0 ? { AND: auctionFilters } : {};

    // Fetch auctions based on filters
    let auctions: any[] = [];
    let totalAuctions = 0;

    // Max bids filter handled after fetching data
    if (maxBids) {
      const isMoreThan20 = maxBids === "20+";
      const maxBidsInt = isMoreThan20 ? null : parseInt(maxBids as string, 10);

      const allAuctions = await prisma.auction.findMany({
        where: auctionWhere,
        include: {
          bids: true, // Include bids for filtering
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              state: true, // Include creator's state in the response
            },
          },
        },
      });

      // Filter auctions based on the count of bids
      if (isMoreThan20) {
        auctions = allAuctions.filter((auction) => auction.bids.length > 20);
      } else {
        auctions = allAuctions.filter(
          (auction) => auction.bids.length <= maxBidsInt!
        );
      }

      // Paginate filtered auctions
      totalAuctions = auctions.length;
      auctions = auctions.slice(skip, skip + parsedLimit);
    } else {
      // If no maxBids filter, fetch directly with pagination
      [auctions, totalAuctions] = await Promise.all([
        prisma.auction.findMany({
          where: auctionWhere,
          include: {
            bids: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                state: true, // Include creator's state in the response
              },
            },
          },
          skip,
          take: parsedLimit,
        }),
        prisma.auction.count({ where: auctionWhere }),
      ]);
    }

    // Fetch mess contractors based on search key and state
    let contractors: any = [];
    if (search || state) {
      const contractorFilters: Prisma.MessContractorWhereInput[] = [];

      // Search filter for contractors
      if (search) {
        contractorFilters.push({
          user: {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        });
      }

      // State filter for contractors
      if (state) {
        contractorFilters.push({
          user: {
            state: state as State, // Filter by contractor's state
          },
        });
      }

      contractors = await prisma.messContractor.findMany({
        where: {
          AND: contractorFilters,
          user: {
            role: "CONTRACTOR", // Ensure role is CONTRACTOR
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              state: true, // Include state in the response
            },
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Auctions and contractors fetched successfully",
      data: {
        auctions,
        contractors,
      },
      pagination: {
        totalAuctions,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalAuctions / parsedLimit),
      },
    });
    return;
  } catch (error) {
    console.error("Auction and contractor filter error:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching auctions and contractors",
    });
    return;
  }
};
