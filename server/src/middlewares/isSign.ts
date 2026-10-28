import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  email: string;
}

export const isSign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token =
        req.cookies?.["__Secure-next-auth.session-token"] ||
        req.cookies?.["next-auth.session-token"];
    }

    if (!token) {
      res.status(401).json({
        message: "Unauthorized: No token provided",
        success: false,
      });
      return;
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      res.status(500).json({
        error: "Server configuration error",
        success: false,
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({
        message: "Unauthorized: Invalid session token",
        success: false,
      });
      return;
    }

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      success: false,
    });
    return;
  }
};
