import { Request, Response, NextFunction } from "express";
import { getToken } from "next-auth/jwt";

export const isSign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const cookies = req.cookies;
    const token = req.cookies['__Secure-next-auth.session-token'] || 
              req.cookies['next-auth.session-token'];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No session token found" });
    }

    const decodedToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid session token" });
    }
    console.log("Decoded Token:");
   console.log(decodedToken);
    req.userId = decodedToken.id as string;
    req.role = decodedToken.role as string;
    
    next();
  } catch (error) {
    console.error("Error in isSign middleware:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
