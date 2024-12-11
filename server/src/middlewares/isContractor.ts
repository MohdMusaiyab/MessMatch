import { Request, Response, NextFunction } from "express";

export const isContractor = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  try {
    const role = req?.role;

    if (role === "CONTRACTOR") {
      return next(); // Proceed to the next middleware or route handler
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not a contractor", success: false });
    }
  } catch (error) {
    console.error("Error in isContractor middleware:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
