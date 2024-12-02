import { Request, Response } from "express";
import { loginSchema } from "../schemas/auth/loginSchema";
import { comparePassword } from "../utils/auth";
import prisma from "../utils/prisma";
export const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (error) {
    console.log(error);
  }
};
export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    //Parsing the body according to the schema
    const parsedBody = loginSchema.parse(req.body);
    const { email, password } = parsedBody;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exists", success: false });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user; // Exclude password from the response
    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
