import { Request, Response } from "express";
import { CreateUserSchema, LoginSchema } from "../schemas/schemas";
import { comparePassword, hashPassword } from "../utils/auth";
import { ZodError } from "zod";
import prisma from "../utils/prisma";

export const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const parsedBody = CreateUserSchema.parse(req.body);
    const {
      email,
      password,
      name,
      role,
      securityQuestion,
      securityAnswer,
      address,
      contactNumber,
      state
    } = parsedBody;

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    // Hash the password and security answer
    const hashedPassword = await hashPassword(password);
    const hashedSecurityAnswer = await hashPassword(securityAnswer);

    // Create the new user with security question and hashed answer
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        securityQuestion,
        securityAnswer: hashedSecurityAnswer,
        address,
        contactNumber,
        state
      },
    });
    if (role === "CONTRACTOR") {
      await prisma.messContractor.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        success: false,
      });
    }

    console.error("Error in creating user:", error);
    return res.status(500).json({
      message: "Error in creating User",
      success: false,
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    //Parsing the body according to the schema

    const parsedBody = LoginSchema.parse(req.body);
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
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const { password: _, ...userWithoutPassword } = user; // Exclude password from the response
    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        success: false,
      });
    }

    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Try again.", success: false });
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, securityQuestion, securityAnswer, newPassword } = req.body;

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

    if (user.securityQuestion !== securityQuestion) {
      return res
        .status(400)
        .json({ message: "Invalid security question", success: false });
    }

    const isAnswerValid = await comparePassword(
      securityAnswer,
      user.securityAnswer
    );

    if (!isAnswerValid) {
      return res
        .status(400)
        .json({ message: "Invalid security answer", success: false });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Try again.", success: false });
  }
};
