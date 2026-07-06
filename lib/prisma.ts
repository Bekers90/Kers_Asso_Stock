import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // Assurez-vous d'avoir installé 'pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

// On ne crée l'adapter que s'il n'existe pas déjà dans le Singleton
const getPrisma = () => {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({
        adapter,
    });
};

const prisma = getPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;