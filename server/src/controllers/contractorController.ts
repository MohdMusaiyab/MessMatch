import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateMenuSchema, MenuSchema } from "../schemas/schemas";
import { ZodError } from "zod";
import { Prisma, State } from "@prisma/client";
import { ServiceType } from "@prisma/client";
//For Creating a Menu
export const createMenuController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Please Login", success: false });
    return;
  }
  try {
    //Parse the request body

    const menu = CreateMenuSchema.omit({ contractorId: true }).parse(req.body);
    //Create the menu simply
    const newMenu = await prisma.menu.create({
      data: {
        ...menu,
        contractorId: userId,
      },
    });

    res.status(201).json({
      message: "Menu created successfully",
      success: true,
      data: newMenu,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.errors);
      res.status(400).json({
        message: "Invalid Data",
        success: false,
        errors: error.errors,
      });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong", success: false });
    return;
  }
};
// ===================For Getting you Own Menu's============
export const getMyMenusController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized", success: false });
    return;
  }
  try {
    const menus = await prisma.menu.findMany({
      where: {
        contractorId: userId,
      },
    });
    if (menus.length === 0) {
      res.status(404).json({ message: "No Menus Found", success: false });
      return;
    }
    res.status(200).json({
      message: "Menus fetched successfully",
      success: true,
      data: menus,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong", success: false });
    return;
  }
};
// =================+For Getting Single Menu of Others==================
export const getOthersSingleMenuController = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
    return;
  }
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Menu ID is required.",
      });
      return;
    }
    const menu = await prisma.menu.findUnique({
      where: {
        id,
      },
      select: {
        contractorId: true,
        name: true,

        items: true,
        pricePerHead: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        contractor: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                address: true,
                state: true,
              },
            },
          },
        },
      },
    });
    if (!menu) {
      res.status(404).json({
        success: false,
        message: "Menu not found.",
      });
      return;
    }
    // Send the menu details in the response
    res.status(200).json({
      success: true,
      message: "Menu fetched successfully.",
      data: menu,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something Went Wrong",
      success: false,
    });
    return;
  }
};

// =================For Updating A Menu using its ID================
export const updateMenuController = async (req: Request, res: Response) => {
  const menuId = req.params.id;
  const userId = req.userId;
  if (!menuId) {
    res.status(400).json({
      message: "Menu ID is required",
      success: false,
    });
    return;
  }
  try {
    const updatedMenuData = MenuSchema.omit({ contractorId: true })
      .partial()
      .parse(req.body);
    const menu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });
    if (!menu) {
      res.status(404).json({
        message: "Menu not found",
        success: false,
      });
      return;
    }
    // Ensure the logged-in contractor is the owner of the menu
    if (menu.contractorId !== userId) {
      res.status(403).json({
        message: "Forbidden: You do not have permission to update this menu",
        success: false,
      });
      return;
    }

    const updatedMenu = await prisma.menu.update({
      where: {
        id: menuId,
      },
      data: {
        ...updatedMenuData,
      },
    });
    res.status(200).json({
      message: "Menu updated successfully",
      success: true,
      data: updatedMenu,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong", success: false });
    return;
  }
};

// =========================For Getting a single Menu using its ID================
export const getSingleMenuController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Menu ID is required.",
    });
    return;
  }

  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) {
      res.status(404).json({
        success: false,
        message: "Menu not found.",
      });
      return;
    }
    // Send the menu details in the response
    res.status(200).json({
      success: true,
      message: "Menu fetched successfully.",
      data: menu,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the menu.",
    });
    return;
  }
};

// ===============For Deleting Your Own Menu=======================
export const deleteYourMenuController = async (req: Request, res: Response) => {
  const userId = req?.userId;
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Menu ID is required.",
    });
    return;
  }
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id,
      },
    });
    if (!menu) {
      res.status(404).json({
        success: false,
        message: "Menu not found.",
      });
      return;
    }
    // Check if the menu belongs to the authenticated user
    if (menu.contractorId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this menu.",
      });
      return;
    }
    await prisma.menu.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Menu deleted successfully.",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Deleting Menu",
      success: false,
    });
    return;
  }
};

// ==========================Filter for Contractors==================
// Controller for fetching filtered contractors with pagination and search

export const getFiltersController = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      serviceType,
      menuType,
      state,
      sortBy,
      sortOrder = "asc",
    } = req.query;

    // Parse pagination parameters
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    // Initialize filters array for AND conditions
    const andFilters: Prisma.MessContractorWhereInput[] = [];

    // Search filter
    if (search) {
      andFilters.push({
        OR: [
          {
            user: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
              address: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          },
          {
            menus: {
              some: {
                OR: [
                  {
                    name: {
                      contains: search as string,
                      mode: "insensitive",
                    },
                  },
                  {
                    items: {
                      hasSome: [search as string],
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }

    // State filter (AND condition)
    if (state) {
      andFilters.push({
        user: {
          state: state as State, // Assuming state is an enum or string
        },
      });
    }

    // Menu type filter (AND condition)
    if (menuType) {
      andFilters.push({
        menus: {
          some: {
            type: menuType as any, // Assuming menuType is an enum or string
          },
        },
      });
    }

    // Service type filter (OR condition)
    const orFilters: Prisma.MessContractorWhereInput[] = [];
    if (Array.isArray(serviceType)) {
      orFilters.push({
        services: {
          hasSome: serviceType.map((type) => type as ServiceType), // Map to ServiceType enum
        },
      });
    } else if (serviceType) {
      orFilters.push({
        services: {
          hasSome: [serviceType as ServiceType], // Single value case
        },
      });
    }

    // Combine AND and OR conditions
    const where: Prisma.MessContractorWhereInput = {
      AND: [
        ...andFilters, // All AND conditions
        orFilters.length > 0 ? { OR: orFilters } : {}, // OR conditions (if any)
      ],
    };

    // Sorting
    let orderBy: any = {};
    if (sortBy) {
      switch (sortBy) {
        case "rating":
          orderBy.ratings = sortOrder;
          break;
        case "price":
          orderBy = {
            menus: {
              _min: {
                pricePerHead: sortOrder,
              },
            },
          };
          break;
        default:
          orderBy.createdAt = sortOrder;
      }
    }

    // Fetch data and total count in parallel
    const [contractors, total] = await Promise.all([
      prisma.messContractor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              address: true,
              state: true, // Include state in the response
            },
          },
          menus: true,
        },
        skip,
        take: parsedLimit,
        orderBy,
      }),
      prisma.messContractor.count({ where }),
    ]);

    // Return response
    res.status(200).json({
      success: true,
      message: "Contractors fetched successfully",
      data: contractors,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
    return;
  } catch (error) {
    console.error("Filter controller error:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching filters",
    });
    return;
  }
};
// ============For Getting Latesst 3 Auctions where he had Placed Bid + 3 of his Latest Menu's================

export const getLatestAuctionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const contractorId = req.userId;
    if (!contractorId) {
      res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
      return;
    }
    //Find the Menu's of the contractor latest 3
    const menus = await prisma.menu.findMany({
      where: {
        contractorId,
      },
      orderBy: {
        createdAt: "desc",
      },

      take: 3,
    });

    //Find the Auctions where he had placed bid
    //We randmly fetch him 3 latest auctions
    const auctions = await prisma.auction.findMany({
      where: {},
      select: {
        id: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    //Now merge the response and give to them
    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: {
        menus,
        auctions,
      },
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in fetching latest auctions",
      success: false,
    });
    return;
  }
};

// ==============For Getting the Latest 3 Menus=================
export const getLatestMenusController = async (req: Request, res: Response) => {
  try {
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        name: true,
        pricePerHead: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: menus,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in fetching latest menus",
      success: false,
    });
    return;
  }
};
