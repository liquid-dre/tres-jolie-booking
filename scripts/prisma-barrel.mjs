// Creates barrel export file for generated Prisma client
// Needed because Prisma 7 doesn't generate an index.ts and Turbopack can't resolve bare directory imports
import { writeFileSync, existsSync } from "fs";

const target = "generated/prisma/index.ts";

if (!existsSync(target)) {
  writeFileSync(
    target,
    `export { PrismaClient } from "./client";\nexport * from "./enums";\nexport * from "./models";\nexport * from "./commonInputTypes";\n`
  );
  console.log("Created Prisma barrel file:", target);
} else {
  console.log("Prisma barrel file already exists:", target);
}
