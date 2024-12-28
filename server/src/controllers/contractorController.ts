import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateMenuSchema, MenuSchema } from "../schemas/schemas";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ServiceType } from "@prisma/client";
export const createMenuController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized", success: false });
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

    return res.status(201).json({
      message: "Menu created successfully",
      success: true,
      data: newMenu,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.errors);
      return res.status(400).json({
        message: "Invalid Data",
        success: false,
        errors: error.errors,
      });
    }
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};
// ===================For Getting you Own Menu's============
export const getMyMenusController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  try {
    const menus = await prisma.menu.findMany({
      where: {
        contractorId: userId,
      },
    });
    if (menus.length === 0) {
      return res
        .status(404)
        .json({ message: "No Menus Found", success: false });
    }
    return res.status(200).json({
      message: "Menus fetched successfully",
      success: true,
      data: menus,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};
// =================+For Getting Others Menu==================
export const getOthersMenuController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Extract the user ID from the request parameters
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID not provided",
      });
    }

    // Find the contractor associated with the given user ID
    const contractor = await prisma.messContractor.findUnique({
      where: { userId: id },
      select: { id: true }, // Select only the contractor ID for efficiency
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: "Contractor not found for the given user ID",
      });
    }

    // Fetch menus for the contractor
    const menus = await prisma.menu.findMany({
      where: { contractorId: contractor.id },
      select: {
        id: true,
        name: true,
        items: true,
        pricePerHead: true,
        type: true,
      },
    });

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No menus found for this contractor",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menus fetched successfully",
      data: menus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =================For Updating A Menu using its ID================
export const updateMenuController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const menuId = req.params.id;
  const userId = req.userId;
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
      return res.status(404).json({
        message: "Menu not found",
        success: false,
      });
    }
    // Ensure the logged-in contractor is the owner of the menu
    if (menu.contractorId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to update this menu",
        success: false,
      });
    }
    const updatedMenu = await prisma.menu.update({
      where: {
        id: menuId,
      },
      data: {
        ...updatedMenuData,
      },
    });
    return res.status(200).json({
      message: "Menu updated successfully",
      success: true,
      data: updatedMenu,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};

// =========================For Getting a single Menu using its ID================
export const getSingleMenuController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Menu ID is required.",
    });
  }

  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found.",
      });
    }
    // Send the menu details in the response
    return res.status(200).json({
      success: true,
      message: "Menu fetched successfully.",
      data: menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the menu.",
    });
  }
};

// ===============For Deleting Your Own Menu=======================
export const deleteYourMenuController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req?.userId;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Menu ID is required.",
    });
  }
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id,
      },
    });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found.",
      });
    }
    // Check if the menu belongs to the authenticated user
    if (menu.contractorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this menu.",
      });
    }
    await prisma.menu.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in Deleting Menu",
      success: false,
    });
  }
};

// ==========================Filter for Contractores==================
//Need Check
// Controller for fetching filtered contractors with pagination and search

export const getFiltersController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      serviceType,
      menuType,
      sortBy,
      sortOrder = "asc",
    } = req.query;

    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    // Initialize filters array
    const filters: Prisma.MessContractorWhereInput[] = [];

    // Search filter
    if (search) {
      filters.push({
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

    // Create an array for OR conditions
    const orConditions: Prisma.MessContractorWhereInput[] = [];

    // Service type filter
    if (Array.isArray(serviceType)) {
      orConditions.push({
        services: {
          hasSome: serviceType.map((type) => type as ServiceType), // Map to ServiceType enum
        },
      });
    } else if (serviceType) {
      orConditions.push({
        services: {
          hasSome: [serviceType as ServiceType], // Single value case
        },
      });
    }

    // Menu type filter
    if (menuType) {
      orConditions.push({
        menus: {
          some: {
            type: menuType as any, // Assuming menuType is an enum or string
          },
        },
      });
    }

    // Combine OR conditions into the where clause
    const where: Prisma.MessContractorWhereInput = {
      AND: filters.length > 0 ? filters : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
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
    

    return res.status(200).json({
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
  } catch (error) {
    console.error("Filter controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching filters",
    });
  }
};
