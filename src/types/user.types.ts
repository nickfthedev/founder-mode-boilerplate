// This should reflect the userRole column in the database
// We declare this here, so we don't have to import it from prisma in to the frontend

export type UserRole = "ADMIN" | "USER";
