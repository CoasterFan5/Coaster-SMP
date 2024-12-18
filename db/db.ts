import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { createRequire as cr } from "node:module";

const r = cr(import.meta.url ?? __filename);

const { PrismaClient: PrismaClientImpl } = r("@prisma/client");

export class PrismaClient extends (PrismaClientImpl as typeof PrismaClientType) {}

export const prisma = new PrismaClient();
