import { z } from "zod";
import { contractorSchema } from "../contractor/messContractor";
import { reviewSchema } from "../reviews/reviewSchema";
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter, one number, and one special character"
    ),
  role: z.enum(["COLLEGE", "CONTRACTOR", "CORPORATE", "ADMIN", "OTHER"]),
  securityQuestion: z.enum([
    "MOTHERS_MAIDEN_NAME",
    "FIRST_PET_NAME",
    "FAVORITE_CHILDHOOD_MEMORY",
    "FAVORITE_TEACHER_NAME",
    "BIRTH_TOWN_NAME",
  ]),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  securityAnswer: z.string().min(1, "Security answer is required"),
  createdAt: z.string().datetime("Invalid createdAt format"), // Use z.date() if you're working with Date objects
  updatedAt: z.string().datetime("Invalid updatedAt format"), // Same as above
  contractor: z.optional(contractorSchema), // Referencing the contractorSchema
  reviewsGiven: z.array(reviewSchema).optional(), // Reviews written by the user
});

export type User = z.infer<typeof userSchema>;
