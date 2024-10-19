
// Application Configuration
// ATTENTION: Don't store any sensitive information here.

export type UserRole = "ADMIN" | "USER";

export interface AppConfigInterface {
  canPostBlogPosts: UserRole[];
  canPostBlogPostAsPageOwner: UserRole[];
  canCreatePages: UserRole[];
  fromName: string;
  fromEmail: string;
  contactEmail: string;
  contactEnableDiscord: boolean;
  contactEnableEmail: boolean;
}

export const APP_CONFIG: AppConfigInterface = {
  // Defines who can create, edit and delete blog posts
  canPostBlogPosts: ["ADMIN", "USER"],
  // Defines who can create, edit and delete blog posts as page owner
  canPostBlogPostAsPageOwner: ["ADMIN"],
  // Defines who can create, edit and delete pages
  // DON'T INCLUDE "USER" HERE, because that would allow everyone to create pages
  canCreatePages: ["ADMIN"],
  // Email Settings
  fromName: "NoReply",
  fromEmail: "noreply@example.com",
  // Contact Settings
  contactEmail: "contact@example.com",
  contactEnableDiscord: true,
  contactEnableEmail: true,
};

