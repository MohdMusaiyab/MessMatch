import { Request, RequestHandler, Response } from "express";

export const testController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return res.status(200).json({ message: "Express + TypeScript Server" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
