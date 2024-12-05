import { z } from "zod";
import { reviewSchema } from "../reviews/reviewSchema";
import { menuSchema } from "../menu/menuSchema";
export const contractorSchema = z.object({
  id: z.string().uuid(),
  menus: z.array(menuSchema).optional(), // Array of menu objects
  numberOfPeople: z.number().optional(), // Optional field
  isVeg: z.boolean(),
  isNonVeg: z.boolean(),
  availableFor: z.array(z.enum(["HOSTELS", "CORPORATE_EVENTS", "CORPORATE_OFFICES", "WEDDINGS", "PARTIES", "OTHER"])), // Enum list for service types
  ratings: z.number().min(0).max(5).optional(), // Optional average rating, between 0 and 5
  reviews: z.array(reviewSchema).optional(), // Reviews received by the contractor
});

export type MessContractor = z.infer<typeof contractorSchema>;
