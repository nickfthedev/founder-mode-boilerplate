import { z } from "zod";
import { UserRole, APP_CONFIG } from "~/app/config/app.config";

export const NewBlogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  keywords: z.array(z.string()),
  asPageOwner: z.boolean(),
});

export const UpdateBlogPostSchema = NewBlogPostSchema.extend({
  slug: z.string(),
  published: z.boolean(),
  keywords: z.array(z.string()),
  asPageOwner: z.boolean(),
});


export function canEditBlogPost({ user, post }: { user?: { id: string, userRole: UserRole }, post: { createdById: string, asPageOwner: boolean } }) {
  if (!user) {
    return false;
  }
  // If a user loses his page owner rights, he should not be able to edit the post anymore
  // even if he was able to create it
  if (post.asPageOwner) {
    if (post.asPageOwner && APP_CONFIG.canPostBlogPostAsPageOwner.includes(user.userRole)) {
      return true;
    } else {
      return false;
    }
  }
  if (user.id === post.createdById) {
    return true;
  }
  return false;
}

export function canPostBlogPosts({ user }: { user?: { userRole: UserRole } }) {
  if (!user) {
    return false;
  }
  return APP_CONFIG.canPostBlogPosts.includes(user.userRole);
}

export function canPostBlogPostAsPageOwner({ user }: { user?: { userRole: UserRole } }) {
  if (!user) {
    return false;
  }
  return APP_CONFIG.canPostBlogPostAsPageOwner.includes(user.userRole);
}

export function canSeeBlogPost({ user, post }: { user?: { id: string, userRole: UserRole }, post: { published: boolean, createdById: string, asPageOwner: boolean } }) {
  if (post.published) {
    return true;
  }
  if (!user) {
    return false;
  }
  // If a user loses his page owner rights, he should not be able to see the post anymore (if unpublished)
  // even if he was able to create it
  if (post.asPageOwner) {
    if (APP_CONFIG.canPostBlogPostAsPageOwner.includes(user.userRole)) {
      return true;
    } else {
      return false;
    }
  }

  if (user.id === post.createdById) {
    return true;
  }
  return false;
}
