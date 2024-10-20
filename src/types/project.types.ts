import { z } from "zod";

export const NewProjectSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  url: z.string().min(3, { message: "URL must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  keywords: z.array(z.string()),
  logo: z.string().optional(),
});

export const UpdateProjectSchema = NewProjectSchema.extend({
  id: z.number(),
  slug: z.string(),
});

// Future function to check if a user can create a project
export function canCreateProject({ user }: { user?: { id: string } }) {
  if (!user) {
    return false;
  }
  return true;
}

// Function to check if a user can edit a project
export function canEditProject({ user, project }: { user?: { id: string }, project: { claimedById: string | null } }) {
  if (!project.claimedById) {
    return false;
  }
  if (!user) {
    return false;
  }
  if (user.id === project.claimedById) {
    return true;
  }
  return false;
}
