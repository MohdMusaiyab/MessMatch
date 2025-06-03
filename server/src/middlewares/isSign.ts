import { Request, Response, NextFunction } from "express";
import { getToken } from "next-auth/jwt";

export const isSign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token =
      req.cookies["__Secure-next-auth.session-token"] ||
      req.cookies["next-auth.session-token"];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No session token found" });
      return;
    }

    const decodedToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!decodedToken) {
      res.status(401).json({
        message: "Unauthorized: Invalid session token",
        success: false,
      });
      return;
    }
    req.userId = decodedToken.id as string;
    req.role = decodedToken.role as string;

    next();
  } catch (error) {
    console.error("Error in isSign middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
