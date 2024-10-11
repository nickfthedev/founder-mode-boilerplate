import { canEditBlogPost, NewBlogPostSchema, UpdateBlogPostSchema } from "~/types/blog.types";
import { createTRPCRouter, protectedProcedure, adminProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { canPostBlogPosts, canPostBlogPostAsPageOwner } from "~/types/blog.types";

export const blogRouter = createTRPCRouter({
  /**
   * Function to get all blog posts
   */
  getBlogPosts: publicProcedure.query(async ({ ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return blogPosts;
  }),
  /**
   * Function to get published blog posts
   */
  getPublishedBlogPosts: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: input,
    });
    return blogPosts;
  }),
  /**
   * Function to get a blog post by slug
   */
  getBlogPostBySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const blogPost = await ctx.db.blogPost.findUnique({
      where: { slug: input },
    });
    return blogPost;
  }),
  /**
   * Function to create a new blog post
   */
  createBlogPost: protectedProcedure.input(NewBlogPostSchema).mutation(async ({ input, ctx }) => {
    const { title, content, keywords, asPageOwner } = input;
    if (!canPostBlogPosts({ user: ctx.session.user })) {
      throw new Error("You are not allowed to post blog posts");
    }
    if (asPageOwner && !canPostBlogPostAsPageOwner({ user: ctx.session.user })) {
      throw new Error("You are not allowed to post blog posts as page owner");
    }

    const slug = slugify(title);
    const blogPost = await ctx.db.blogPost.create({
      data: {
        title,
        content,
        slug,
        keywords,
        createdById: ctx.session.user.id,
        asPageOwner,
      },
    });
    return blogPost;
  }),
  /**
   * Function to update a blog post
   */
  updateBlogPost: adminProcedure.input(UpdateBlogPostSchema).mutation(async ({ input, ctx }) => {
    const { title, content, slug, published, keywords, asPageOwner } = input;
    const post = await ctx.db.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new Error("Blog post not found");
    }
    if (!canEditBlogPost({ user: ctx.session?.user, post })) {
      throw new Error("You are not allowed to edit this blog post");
    }
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug },
      data: { title, content, published, keywords, asPageOwner },
    });
    return updatedBlogPost;
  }),
  /**
   * Function to toggle the published status of a blog post
   */
  togglePublished: adminProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const post = await ctx.db.blogPost.findUnique({
      where: { slug: input },
    });
    if (!post) {
      throw new Error("Blog post not found");
    }
    // Check if user is allowed to edit the post
    if (!canEditBlogPost({ user: ctx.session?.user, post })) {
      throw new Error("You are not allowed to toggle the published status of this blog post");
    }
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug: input },
      data: { published: !post.published },
    });
    return updatedBlogPost;
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
