import { z } from "zod";

export const menuSchema = z.object({
  id: z.string().uuid(),
  contractorId: z.string().uuid(), // Relation to the contractor
  name: z.string().min(1, "Menu name is required"), // e.g., "Breakfast Menu"
  items: z.array(z.string().min(1, "Item name cannot be empty")), // List of items in the menu
  pricePerHead: z.number().min(0, "Price per head must be non-negative"),
  isVeg: z.boolean(), // If the menu is vegetarian-only
  isNonVeg: z.boolean(), // If the menu is non-vegetarian
});

export type Menu = z.infer<typeof menuSchema>;
