import { Request, Response } from "express";
import { ZodError } from "zod";
import { hashPassword } from "../utils/auth";
import prisma from "../utils/prisma";

export const updateUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userid = req.userId;
    const { name, email, password, role, securityQuestion, securityAnswer } =
      req.body;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Prepare the update object with only the fields that were provided
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password); // Hashing the password
    if (role) updateData.role = role; // Ensure you have role management logic if needed
    if (securityQuestion) updateData.securityQuestion = securityQuestion;
    if (securityAnswer) updateData.securityAnswer = securityAnswer;

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    // If the error is from a validation (e.g., Zod validation), handle it specifically
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        success: false,
        errors: error.errors,
      });
    }

    // Generic error handling
    return res.status(500).json({
      message: "Error in updating user",
      success: false,
    });
  }
};
// ====================For Getting a Single User Profile====================
export const getUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      message: "User not found",
      success: false,
    });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "User not found",
      success: false,
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        contractor: {
          include: {
            menus: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in getting user",
      success: false,
    });
  }
};

// ==============================For Getting Your Own Profile====================

export const getYourOwnProfileController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      message: "User not found",
      success: false,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contractor: {
          include: {
            menus: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in getting user",
      success: false,
    });
  }
};
