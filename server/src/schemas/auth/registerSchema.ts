import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(["COLLEGE", "CONTRACTOR", "CORPORATE", "ADMIN", "OTHER"])
    .default("OTHER"),
  securityQuestion: z.enum([
    "MOTHERS_MAIDEN_NAME",
    "FIRST_PET_NAME",
    "FAVORITE_CHILDHOOD_MEMORY",
    "FAVORITE_TEACHER_NAME",
    "BIRTH_TOWN_NAME",
  ]),
  securityAnswer: z.string().min(1, "Security answer is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
});

export type SignupInput = z.infer<typeof registerSchema>;
