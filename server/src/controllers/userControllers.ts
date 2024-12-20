import { Request, Response } from "express";
import { ZodError } from "zod";
import { hashPassword } from "../utils/auth";
import prisma from "../utils/prisma";

export const updateUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId; // Extract userId from the request
    const userRole = req.role; // Extract role from the request
    const {
      name,
      email,
      password,
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
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Prepare the update object for the User table
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password); // Hashing the password
    if (securityQuestion) updateData.securityQuestion = securityQuestion;
    if (securityAnswer)
      updateData.securityAnswer = await hashPassword(securityAnswer);

    // Role-based additional updates
    if (userRole === "CONTRACTOR" && contractorFields) {
      const { numberOfPeople, services } = contractorFields;

      // Ensure contractor record exists
      if (!user.contractor) {
        return res.status(400).json({
          message: "Contractor record not found for this user",
          success: false,
        });
      }

      // Update contractor-specific fields
      await prisma.messContractor.update({
        where: { userId: userId },
        data: {
          numberOfPeople: numberOfPeople ?? user.contractor.numberOfPeople,
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

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    // Handle Zod validation errors specifically
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
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        contactNumber: true,
        role: true,
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
//Need Edits
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
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        securityQuestion: true,
        contactNumber: true,
        role: true,
        contractor: {
          select: {
            numberOfPeople: true,
            services: true,
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
