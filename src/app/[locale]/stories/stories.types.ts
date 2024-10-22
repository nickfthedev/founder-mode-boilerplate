import { z } from "zod";
import { UserRole } from "~/types/user.types";

export interface StoryInterface {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  contentParts: string[];
  images: string[];
  published: boolean;
  thumbsUp: number;
  thumbsDown: number;
  generatedById: string;
}

export type Plan = "FREE" | "PREMIUM";

export const CreateStorySchema = z.object({
  prompt: z.string().min(1, { message: "Content is required" }),
});

export function canGenerateNewStories(user: {
  userRole: UserRole;
  plan: Plan;
}) {
  return user.userRole === "ADMIN" || user.plan === "PREMIUM";
}

