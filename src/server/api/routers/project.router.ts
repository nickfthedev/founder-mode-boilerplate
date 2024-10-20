import { createTRPCRouter, protectedProcedure, adminProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { canCreateProject, canEditProject, NewProjectSchema, UpdateProjectSchema } from "~/types/project.types";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  // Get all projects
  getAllProjects: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany();
  }),
  // Get a project by id
  getProjectById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    return await ctx.db.project.findUnique({ where: { id: input.id } });
  }),
  // Get a project by slug
  getProjectBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input, ctx }) => {
    return await ctx.db.project.findUnique({ where: { slug: input.slug } });
  }),
  // Get all projects claimed by a user
  getProjectsClaimedByUser: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    return await ctx.db.project.findMany({ where: { claimedById: input.userId } });
  }),
  // Create a new project
  createProject: protectedProcedure.input(NewProjectSchema).mutation(async ({ input, ctx }) => {
    if (!canCreateProject({ user: ctx.session?.user })) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not allowed to create a project" });
    }
    const project = await ctx.db.project.create({
      data: { ...input, slug: slugify(input.name) },
    });
    return project.id;
  }),
  // Edit a project
  editProject: protectedProcedure.input(UpdateProjectSchema).mutation(async ({ input, ctx }) => {
    const project = await ctx.db.project.findUnique({
      where: { id: input.id },
    });
    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
    }
    if (!canEditProject({ user: ctx.session?.user, project })) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not allowed to edit this project" });
    }
    const updatedProject = await ctx.db.project.update({
      where: { id: input.id },
      data: { ...input },
    });
    return updatedProject.id;
  }),
  // Delete a project
  deleteProject: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    const project = await ctx.db.project.findUnique({
      where: { id: input.id },
    });
    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
    }
    if (!canEditProject({ user: ctx.session?.user, project })) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not allowed to delete this project" });
    }
    await ctx.db.project.delete({
      where: { id: input.id },
    });
  }),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim();                  // Trim leading/trailing spaces and hyphens
}
