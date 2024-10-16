import { z } from "zod";

// This should reflect the userRole column in the database
// We declare this here, so we don't have to import it from prisma in to the frontend

export type UserRole = "ADMIN" | "USER";

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  avatar: z.string().optional(),
  acceptedMarketing: z.boolean().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and _" })
    .optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional(),
  public: z.boolean().optional(),
  twitter: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('x.com') || url.includes('twitter.com'),
    { message: "Please enter a valid Twitter or X.com URL" }
  ).optional(),
  instagram: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('instagram.com'),
    { message: "Please enter a valid Instagram URL" }
  ).optional(),
  facebook: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('facebook.com'),
    { message: "Please enter a valid Facebook URL" }
  ).optional(),
  linkedin: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('linkedin.com'),
    { message: "Please enter a valid LinkedIn URL" }
  ).optional(),
  youtube: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('youtube.com'),
    { message: "Please enter a valid YouTube URL" }
  ).optional(),
  tiktok: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('tiktok.com'),
    { message: "Please enter a valid TikTok URL" }
  ).optional(),
  github: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('github.com'),
    { message: "Please enter a valid GitHub URL" }
  ).optional(),
  discord: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('discord.gg'),
    { message: "Please enter a valid Discord URL" }
  ).optional(),
  twitch: z.string().url({ message: "Please enter a valid URL" }).refine(
    (url) => url.includes('twitch.tv'),
    { message: "Please enter a valid Twitch URL" }
  ).optional(),
})