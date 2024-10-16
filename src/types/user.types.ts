import { z } from "zod";

// This should reflect the userRole column in the database
// We declare this here, so we don't have to import it from prisma in to the frontend

export type UserRole = "ADMIN" | "USER";

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  avatar: z.string().optional(),
  acceptedMarketing: z.boolean().optional(),
})