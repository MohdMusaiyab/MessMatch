import { Request, Response } from "express";
import { CreateUserSchema, LoginSchema } from "../schemas/schemas";
import { comparePassword, hashPassword } from "../utils/auth";
import { ZodError } from "zod";
import prisma from "../utils/prisma";
import { isDemoAccount } from "../utils/demo";

export const registerController = async (req: Request, res: Response) => {
  try {
    if (req.body?.role === "ADMIN") {
      res.status(403).json({
        message: "Admin role cannot be self-assigned",
        success: false,
      });
      return;
    }

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

    if (isDemoAccount(email)) {
      res.status(400).json({
        message: "This email is reserved for demo accounts",
        success: false,
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "Email already exists", success: false });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const normalizedAnswer = securityAnswer.trim().toLowerCase();
    const hashedSecurityAnswer = await hashPassword(normalizedAnswer);

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
    const parsedBody = LoginSchema.parse(req.body);
    const { email, password } = parsedBody;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials", success: false });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }

    const { password: _, securityAnswer: __, ...userWithoutPassword } = user;
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
    res.status(500).json({
      message: "Something went wrong! Try again.",
      success: false,
    });
    return;
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, securityQuestion, securityAnswer, newPassword } = req.body;

    if (!email || !securityQuestion || !securityAnswer || !newPassword) {
      res.status(400).json({
        message: "All fields are required",
        success: false,
      });
      return;
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
      return;
    }

    if (isDemoAccount(email)) {
      res.status(403).json({
        message: "Password reset is disabled for demonstration accounts.",
        success: false,
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      await comparePassword("dummy", "$2a$10$e79e6k4HqL2Q9r8kQ7W0nOBW9hO3sJ1jG7E8g9H0k1L2M3N4O5P6Q");
      res.status(400).json({
        message: "Invalid email, security question, or answer",
        success: false,
      });
      return;
    }

    if (user.securityQuestion !== securityQuestion) {
      res.status(400).json({
        message: "Invalid email, security question, or answer",
        success: false,
      });
      return;
    }

    const normalizedAnswer = String(securityAnswer).trim().toLowerCase();
    const isAnswerValid = await comparePassword(
      normalizedAnswer,
      user.securityAnswer
    );

    if (!isAnswerValid) {
      res.status(400).json({
        message: "Invalid email, security question, or answer",
        success: false,
      });
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

    res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({
      message: "Something went wrong! Try again.",
      success: false,
    });
    return;
  }
};
