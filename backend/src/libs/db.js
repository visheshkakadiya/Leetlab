import { PrismaClient } from '../generated/prisma/index.js'

// globalThis is available in all browsers
// what is globalThis in nodejs? => globalThis is the global object in Node.js of the current execution environment
const globalForPrisma = globalThis;

// if globalForPrisma.prisma exists, use it otherwise, create new prisma instance
// by this way we can access all prisma methods in db
export const db = globalForPrisma.prisma || new PrismaClient();

// if you're node is not in production, set globalForPrisma.prisma to db(like give new prisma instance)
if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db