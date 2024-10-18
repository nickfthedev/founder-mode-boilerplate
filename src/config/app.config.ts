
// Application Configuration
// ATTENTION: Don't store any sensitive information here.

export type UserRole = "ADMIN" | "USER";

export interface AppConfigInterface {
  canPostBlogPosts: UserRole[];
  canPostBlogPostAsPageOwner: UserRole[];
  canCreatePages: UserRole[];
  emailProvider: string[];
  fromName: string;
  fromEmail: string;
}

export const APP_CONFIG: AppConfigInterface = {
  // Defines who can create, edit and delete blog posts
  canPostBlogPosts: ["ADMIN", "USER"],
  // Defines who can create, edit and delete blog posts as page owner
  canPostBlogPostAsPageOwner: ["ADMIN"],
  // Defines who can create, edit and delete pages
  // DON'T INCLUDE "USER" HERE, because that would allow everyone to create pages
  canCreatePages: ["ADMIN"],
  // Email Provider
  // RESEND: Send via Resend
  // CONSOLE: Log to console
  // Every provider in this array will be used in order to send an email
  // Dont forget to add the credentials to the env file
  emailProvider: ["CONSOLE"],
  fromName: "Blog",
  fromEmail: "blog@example.com",
};

