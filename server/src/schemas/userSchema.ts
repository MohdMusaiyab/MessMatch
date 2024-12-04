import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["COLLEGE", "CONTRACTOR", "CORPORATE", "ADMIN", "OTHER"]),
  securityQuestion: z.enum([
    "MOTHERS_MAIDEN_NAME",
    "FIRST_PET_NAME",
    "FAVORITE_CHILDHOOD_MEMORY",
    "FAVORITE_TEACHER_NAME",
    "BIRTH_TOWN_NAME",
  ]),
  securityAnswer: z.string().min(1, "Security answer is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
