import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateMenuSchema, MenuSchema } from "../schemas/schemas";
import { ZodError } from "zod";

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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contractor ID not provided",
      });
    }

    const menus = await prisma.menu.findMany({
      where: {
        contractorId: id,
      },
      select: {
        id: true,
        name: true,
        items: true,
        pricePerHead: true,
        type: true,
        contractor: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!menus || menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Menus found for this contractor",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menus fetched successfully",
      data: menus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        pricePerHead: menu.pricePerHead,
        type: menu.type,
        contractor: menu.contractor,
      })),
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
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
export const getFilteredContractorsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { search, menuType, serviceType, page = 1, limit = 10 } = req.query;

  try {
    // Parse pagination query parameters
    const pageNumber = parseInt(page as string);
    const pageLimit = parseInt(limit as string);

    // Validate and parse menuType to match Prisma enum
    const validMenuTypes = ["VEG", "NON_VEG", "BOTH"]; // Enum values from Prisma schema
    const menuTypeFilter =
      typeof menuType === "string" && validMenuTypes.includes(menuType)
        ? menuType
        : undefined;

    // Validate and parse serviceType to match Prisma enum
    const validServiceTypes = [
      "HOSTELS",
      "CORPORATE_EVENTS",
      "CORPORATE_OFFICES",
      "WEDDINGS",
      "PARTIES",
      "OTHER",
    ];
    const serviceTypeFilter =
      typeof serviceType === "string" && validServiceTypes.includes(serviceType)
        ? serviceType
        : undefined;

    // Initialize filter options
    const filters: any = {
      where: {
        // Apply search if search term is provided (check name of contractor and menu items)
        OR: search
          ? [
              {
                user: {
                  name: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              },
              {
                menus: {
                  some: {
                    name: {
                      contains: search as string,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ]
          : [],
        // Apply menuType filter if valid menuType is provided
        ...(menuTypeFilter && { menus: { some: { type: menuTypeFilter } } }),
        // Apply serviceType filter if valid serviceType is provided
        ...(serviceTypeFilter && { serviceType: serviceTypeFilter }),
      },
      skip: (pageNumber - 1) * pageLimit, // Pagination (skip records based on page number)
      take: pageLimit, // Limit the number of results per page
      include: {
        user: true, // Include user details (contractor's information)
        menus: true, // Include menu details for contractors
        reviews: true, // Include reviews associated with contractors
      },
    };

    // Fetch filtered contractors from the database
    const contractors = await prisma.messContractor.findMany(filters);

    // Count total contractors based on filters for pagination
    const totalContractors = await prisma.messContractor.count({
      where: filters.where,
    });

    // Return paginated contractors along with pagination details
    return res.status(200).json({
      message: "Contractors fetched successfully",
      success: true,
      data: contractors,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalContractors / pageLimit),
        totalItems: totalContractors,
      },
    });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
