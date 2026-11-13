import mysql from "mysql2/promise";
import { mockSqlQuery, dummyPrisma } from "./dummyDb.js";

let realPool = null;
let useRealDb = false;

// Only attempt real MySQL if explicitly configured in environment
if (process.env.USE_REAL_DB === "true" && process.env.DB_HOST) {
  try {
    realPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ai_digital",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });
    useRealDb = true;
  } catch (err) {
    console.warn("Real MySQL initialization failed, using dummy database:", err.message);
    useRealDb = false;
  }
}

// Unified pool interface that executes queries seamlessly against Dummy DB (or real DB if enabled)
const pool = {
  async query(sql, params = []) {
    if (useRealDb && realPool) {
      try {
        return await realPool.query(sql, params);
      } catch (err) {
        if (err.code === "ECONNREFUSED" || err.code === "ER_ACCESS_DENIED_ERROR") {
          // Gracefully fall back to dummy DB
          return await mockSqlQuery(sql, params);
        }
        throw err;
      }
    }
    return await mockSqlQuery(sql, params);
  },

  async execute(sql, params = []) {
    return this.query(sql, params);
  },

  async getConnection() {
    return {
      query: (sql, params) => this.query(sql, params),
      execute: (sql, params) => this.execute(sql, params),
      release: () => {},
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
    };
  },

  // Attach prisma directly to pool so both import styles work seamlessly
  prisma: dummyPrisma,
  user: dummyPrisma.user,
  attendance: dummyPrisma.attendance,
  task: dummyPrisma.task,
  leaveRequest: dummyPrisma.leaveRequest,
  client: dummyPrisma.client,
  clientDelivery: dummyPrisma.clientDelivery,
  clientTask: dummyPrisma.clientTask,
  plan: dummyPrisma.plan,
  clientFeedback: dummyPrisma.clientFeedback,
  callRecord: dummyPrisma.callRecord,
  renewalRequest: dummyPrisma.renewalRequest,
  auditLog: dummyPrisma.auditLog,
};

export async function ensureVisitorsTable() {
  // Handled automatically by dummyDb
  return true;
}

export const prisma = dummyPrisma;
export { pool };
export default pool;
