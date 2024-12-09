import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CreateMenuSchema } from "../schemas/schemas";

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
    const menu = CreateMenuSchema.parse(req.body);
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
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  const id = req.params.id;
  try {
    if (userId !== id) {
      return res
        .status(401)
        .json({
          message: "You Can only update Your own Profile",
          success: false,
        });
    }
    
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};

// ==========For Getting a Single Contractor==========

export const getSingleContractorController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const contractorId = req.params.id;
  const requestUserId = req.userId;

  try {
    // Fetch contractor details along with related data
    const contractor = await prisma.messContractor.findUnique({
      where: {
        id: contractorId,
      },
      include: {
        user: true, // Include full user details
        menus: true, // Include all menus
        reviews: {
          include: {
            reviewer: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!contractor) {
      return res
        .status(404)
        .json({ message: "Contractor not found", success: false });
    }

    // Remove sensitive information if the requesting user is not the contractor
    const isOwner = contractor.userId === requestUserId;
    const responseContractor = {
      ...contractor,
      user: isOwner ? contractor.user : { name: contractor.user.name },
    };

    return res.status(200).json({
      message: "Contractor fetched successfully",
      success: true,
      data: responseContractor,
    });
  } catch (error) {
    console.error("Error fetching contractor:", error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong", success: false });
  }
};
