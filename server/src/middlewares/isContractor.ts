import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
export const isContractor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.userId;

    const contractor = await prisma.messContractor.findUnique({
      where: { userId: userId },
    });
    if (!contractor) {
       res.status(403).json({
        error: "You are not a contractor",
        success: false,
      });
      return;
    }
    req.userId = contractor.id;
    next();
  } catch (error) {
    console.error("Error in isContractor middleware:", error);
     res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
      return;
  }
};
