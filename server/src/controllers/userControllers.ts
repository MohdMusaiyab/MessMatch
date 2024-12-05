import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../utils/prisma";

export const updateUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in updating user",
      success: false,
    });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in deleting user",
      success: false,
    });
  }
};
