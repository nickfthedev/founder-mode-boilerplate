import { z } from "zod";
import { UserRole, APP_CONFIG } from "~/config/app.config";

export const NewPageSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  keywords: z.array(z.string()),
  language: z.enum(["en", "de"]), // Add this line
});

export const UpdatePageSchema = NewPageSchema.extend({
  id: z.number().optional(),
  slug: z.string(),
  published: z.boolean(),
});

export function canCreatePages({ user }: { user?: { userRole: UserRole } }) {
  if (!user) {
    return false;
  }
  return APP_CONFIG.canCreatePages.includes(user.userRole);
}

export function canSeePage({ user, page }: { user?: { id: string, userRole: UserRole }, page: { published: boolean } }) {
  if (page.published) {
    return true;
  }
  if (!user) {
    return false;
  }
  // If a user loses his page owner rights, he should not be able to see the post anymore (if unpublished)
  // even if he was able to create it
  if (APP_CONFIG.canPostBlogPostAsPageOwner.includes(user.userRole)) {
    return true;
  }

  return false;
}
