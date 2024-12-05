import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string().uuid(),
  contractorId: z.string().uuid(),
  reviewerId: z.string().uuid(), // User who left the review
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: z.string().optional(), // Optional comment
  createdAt: z.string().datetime("Invalid createdAt format"),
});

export type Review = z.infer<typeof reviewSchema>;
