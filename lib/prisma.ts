// Re-export Prisma client and types from generated output
// This file exists because Turbopack cannot resolve bare directory imports
// to generated/prisma/ (which has no index.ts barrel file in Prisma 7)
export { PrismaClient } from "../generated/prisma/client";
export * from "../generated/prisma/enums";
