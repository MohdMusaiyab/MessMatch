import { Request, Response } from "express";
import { ZodError } from "zod";
import { hashPassword } from "../utils/auth";
import prisma from "../utils/prisma";
import { Prisma, State } from "@prisma/client";
import { isDemoAccount } from "../utils/demo";

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const userRole = req.role;
    const {
      name,
      email,
      password,
      state,
      address,
      contactNumber,
      securityQuestion,
      securityAnswer,
      contractorFields,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contractor: true },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    if (isDemoAccount(user.email)) {
      res.status(403).json({
        message: "Demo account profile is locked to preserve shared evaluation credentials.",
        success: false,
      });
      return;
    }

    if (email && isDemoAccount(email) && email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      res.status(400).json({
        message: "Cannot reassign profile to a reserved demo email.",
        success: false,
      });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (state) updateData.state = state;
    if (address) updateData.address = address;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (password) {
      if (typeof password !== "string" || password.length < 6) {
        res.status(400).json({
          message: "Password must be at least 6 characters long",
          success: false,
        });
        return;
      }
      updateData.password = await hashPassword(password);
    }
    if (securityQuestion) updateData.securityQuestion = securityQuestion;
    if (securityAnswer) {
      updateData.securityAnswer = await hashPassword(
        String(securityAnswer).trim().toLowerCase()
      );
    }

    if (userRole === "CONTRACTOR" && contractorFields) {
      const { numberOfPeople, services } = contractorFields;

      if (!user.contractor) {
        res.status(400).json({
          message: "Contractor record not found for this user",
          success: false,
        });
        return;
      }

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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, securityAnswer: __, ...sanitizedUser } = updatedUser;

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: sanitizedUser,
    });
    return;
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation error",
        success: false,
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      message: "Error in updating user",
      success: false,
    });
    return;
  }
};
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

    let auctions: any[] = [];
    let totalAuctions = 0;

    if (maxBids) {
      const isMoreThan20 = maxBids === "20+";
      const maxBidsInt = isMoreThan20 ? null : parseInt(maxBids as string, 10);

      let bidCondition: Prisma.AuctionWhereInput = {};
      if (isMoreThan20) {
        const matchingGroups = await prisma.bid.groupBy({
          by: ["auctionId"],
          _count: { id: true },
          having: {
            id: {
              _count: { gt: 20 },
            },
          },
        });
        bidCondition = { id: { in: matchingGroups.map((g) => g.auctionId) } };
      } else if (maxBidsInt !== null && !isNaN(maxBidsInt)) {
        const excludedGroups = await prisma.bid.groupBy({
          by: ["auctionId"],
          _count: { id: true },
          having: {
            id: {
              _count: { gt: maxBidsInt },
            },
          },
        });
        bidCondition = { id: { notIn: excludedGroups.map((g) => g.auctionId) } };
      }

      const combinedAuctionWhere: Prisma.AuctionWhereInput = {
        AND: [auctionWhere, bidCondition],
      };

      [auctions, totalAuctions] = await Promise.all([
        prisma.auction.findMany({
          where: combinedAuctionWhere,
          include: {
            bids: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                state: true,
              },
            },
          },
          skip,
          take: parsedLimit,
        }),
        prisma.auction.count({ where: combinedAuctionWhere }),
      ]);
    } else {
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
                state: true,
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

    const formattedAuctions = auctions.map((auction) => {
      const bidCount = auction.bids ? auction.bids.length : 0;
      let highestBid: number | null = null;
      if (auction.bids && auction.bids.length > 0) {
        highestBid = Math.max(...auction.bids.map((b: any) => b.amount));
      }
      return {
        ...auction,
        bidCount,
        highestBid,
      };
    });

    res.status(200).json({
      success: true,
      message: "Auctions and contractors fetched successfully",
      data: {
        auctions: formattedAuctions,
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
