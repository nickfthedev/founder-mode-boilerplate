
// Application Configuration
// ATTENTION: Don't store any sensitive information here.

export type UserRole = "ADMIN" | "USER";

export interface AppConfigInterface {
  canPostBlogPosts: UserRole[];
  canPostBlogPostAsPageOwner: UserRole[];
}

export const APP_CONFIG: AppConfigInterface = {
  // Defines who can create, edit and delete blog posts
  canPostBlogPosts: ["ADMIN", "USER"],
  // Defines who can create, edit and delete blog posts as page owner
  canPostBlogPostAsPageOwner: ["ADMIN"],
};

