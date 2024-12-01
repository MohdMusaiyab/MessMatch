import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(["COLLEGE", "CONTRACTOR", "CORPORATE", "ADMIN", "OTHER"])
    .default("OTHER"),
});

export type SignupInput = z.infer<typeof registerSchema>;
