import { Request, Response } from "express";
import { CreateUserSchema, LoginSchema } from "../schemas/schemas";
import { comparePassword, hashPassword } from "../utils/auth";
import { ZodError } from "zod";
import prisma from "../utils/prisma";

export const registerController = async (req: Request, res: Response) => {
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
      state,
    } = parsedBody;

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      res.status(400).json({ message: "Email already exists", success: false });
      return;
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
        state,
      },
    });
    if (role === "CONTRACTOR") {
      await prisma.messContractor.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        success: false,
      });
      return;
    }

    console.error("Error in creating user:", error);
    res.status(500).json({
      message: "Error in creating User",
      success: false,
    });
    return;
  }
};

export const loginController = async (req: Request, res: Response) => {
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
      res.status(400).json({ message: "User does not exists", success: false });
      return;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }
    const { password: _, ...userWithoutPassword } = user; // Exclude password from the response
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      success: true,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        success: false,
      });
      return;
    }

    console.error("Error in login:", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Try again.", success: false });
    return;
  }
};

//For the forgot password functionality
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, securityQuestion, securityAnswer, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "User does not exists", success: false });
      return;
    }

    if (user.securityQuestion !== securityQuestion) {
      res
        .status(400)
        .json({ message: "Invalid security question", success: false });
      return;
    }

    const isAnswerValid = await comparePassword(
      securityAnswer,
      user.securityAnswer
    );

    if (!isAnswerValid) {
      res
        .status(400)
        .json({ message: "Invalid security answer", success: false });
      return;
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

    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
    return;
  } catch (error) {
    console.error("Error in forgot password:", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Try again.", success: false });
    return;
  }
};
