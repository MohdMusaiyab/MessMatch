import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["COLLEGE", "CONTRACTOR", "CORPORATE", "ADMIN", "OTHER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof userSchema>;
