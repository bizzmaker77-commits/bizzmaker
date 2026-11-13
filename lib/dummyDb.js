import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "dummy-db.json");

// In-memory cache of the database
let cachedDb = null;
let saveTimeout = null;

export function loadDb() {
  if (cachedDb) return cachedDb;

  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf8");
      cachedDb = JSON.parse(content);
      return cachedDb;
    }
  } catch (err) {
    console.warn("Could not read dummy-db.json, re-initializing:", err.message);
  }

  // Fallback initial structure
  cachedDb = {
    users: [],
    attendance: [],
    tasks: [],
    leaveRequests: [],
    clients: [],
    clientDeliveries: [],
    clientTasks: [],
    callRecords: [],
    renewalRequests: [],
    auditLogs: [],
    blogs: [],
    pricing_plans: [],
    portfolio_items: [],
    visibility_items: [],
    website_visitors: [],
    job_applications: [],
    onboarding_details: [],
    checkout_exit_feedback: [],
    whatsapp_logs: []
  };
  saveDb();
  return cachedDb;
}

export function saveDb() {
  if (!cachedDb) return;
  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(cachedDb, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing dummy-db.json:", err.message);
  }
}

export function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDb();
  }, 100);
}

// Helper to filter objects matching a Prisma "where" clause
function matchesWhere(item, where) {
  if (!where || Object.keys(where).length === 0) return true;

  for (const [key, condition] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(condition)) {
      const matchAny = condition.some((cond) => matchesWhere(item, cond));
      if (!matchAny) return false;
      continue;
    }
    if (key === "AND" && Array.isArray(condition)) {
      const matchAll = condition.every((cond) => matchesWhere(item, cond));
      if (!matchAll) return false;
      continue;
    }

    const val = item[key];

    if (condition !== null && typeof condition === "object") {
      if ("equals" in condition && val !== condition.equals) return false;
      if ("not" in condition && val === condition.not) return false;
      if ("in" in condition && Array.isArray(condition.in) && !condition.in.includes(val)) return false;
      if ("notIn" in condition && Array.isArray(condition.notIn) && condition.notIn.includes(val)) return false;
      if ("contains" in condition) {
        const needle = String(condition.contains).toLowerCase();
        const haystack = String(val || "").toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if ("gte" in condition && !(val >= condition.gte)) return false;
      if ("lte" in condition && !(val <= condition.lte)) return false;
      if ("gt" in condition && !(val > condition.gt)) return false;
      if ("lt" in condition && !(val < condition.lt)) return false;
    } else {
      if (val !== condition) return false;
    }
  }

  return true;
}

function applySelect(obj, select) {
  if (!obj || !select || typeof select !== "object") return obj;
  const filtered = {};
  for (const [key, isSelected] of Object.entries(select)) {
    if (isSelected && key in obj) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

// Generic model mock factory
function createModelHandler(collectionName, relationsConfig = {}) {
  return {
    async findUnique(args = {}) {
      const { where, include, select } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      const item = list.find((it) => matchesWhere(it, where));
      if (!item) return null;
      let res = resolveIncludes(item, include, relationsConfig);
      if (select) res = applySelect(res, select);
      return res;
    },

    async findFirst(args = {}) {
      const { where, include, select, orderBy } = args;
      const db = loadDb();
      let list = [...(db[collectionName] || [])];
      if (where) {
        list = list.filter((it) => matchesWhere(it, where));
      }
      if (orderBy) {
        applyOrderBy(list, orderBy);
      }
      const item = list[0];
      if (!item) return null;
      let res = resolveIncludes(item, include, relationsConfig);
      if (select) res = applySelect(res, select);
      return res;
    },

    async findMany(args = {}) {
      const { where, include, select, orderBy, take, skip } = args;
      const db = loadDb();
      let list = [...(db[collectionName] || [])];

      if (where) {
        list = list.filter((it) => matchesWhere(it, where));
      }

      if (orderBy) {
        applyOrderBy(list, orderBy);
      }

      if (typeof skip === "number") {
        list = list.slice(skip);
      }
      if (typeof take === "number") {
        list = list.slice(0, take);
      }

      return list.map((item) => {
        let res = resolveIncludes(item, include, relationsConfig);
        if (select) res = applySelect(res, select);
        return res;
      });
    },

    async create(args = {}) {
      const { data, include, select } = args;
      const db = loadDb();
      if (!db[collectionName]) db[collectionName] = [];

      let nextId = 1;
      if (db[collectionName].length > 0) {
        const numericIds = db[collectionName].map((i) => Number(i.id)).filter((n) => !isNaN(n));
        if (numericIds.length > 0) {
          nextId = Math.max(...numericIds) + 1;
        }
      }

      const newItem = {
        id: data.id !== undefined ? data.id : nextId,
        createdAt: data.createdAt || new Date().toISOString(),
        ...data,
      };

      db[collectionName].push(newItem);
      scheduleSave();

      let res = resolveIncludes(newItem, include, relationsConfig);
      if (select) res = applySelect(res, select);
      return res;
    },

    async update(args = {}) {
      const { where, data, include, select } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      const index = list.findIndex((it) => matchesWhere(it, where));

      if (index === -1) {
        throw new Error(`Record to update not found in ${collectionName}`);
      }

      const current = list[index];
      const updated = {
        ...current,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      list[index] = updated;
      scheduleSave();

      let res = resolveIncludes(updated, include, relationsConfig);
      if (select) res = applySelect(res, select);
      return res;
    },

    async updateMany(args = {}) {
      const { where, data } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      let count = 0;

      for (let i = 0; i < list.length; i++) {
        if (matchesWhere(list[i], where)) {
          list[i] = { ...list[i], ...data, updatedAt: new Date().toISOString() };
          count++;
        }
      }

      if (count > 0) scheduleSave();
      return { count };
    },

    async upsert(args = {}) {
      const { where, create, update, include, select } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      const index = list.findIndex((it) => matchesWhere(it, where));

      if (index !== -1) {
        const updated = {
          ...list[index],
          ...update,
          updatedAt: new Date().toISOString(),
        };
        list[index] = updated;
        scheduleSave();
        let res = resolveIncludes(updated, include, relationsConfig);
        if (select) res = applySelect(res, select);
        return res;
      } else {
        return this.create({ data: create, include, select });
      }
    },

    async delete(args = {}) {
      const { where } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      const index = list.findIndex((it) => matchesWhere(it, where));

      if (index === -1) {
        throw new Error(`Record to delete not found in ${collectionName}`);
      }

      const [deleted] = list.splice(index, 1);
      scheduleSave();
      return deleted;
    },

    async deleteMany(args = {}) {
      const { where } = args;
      const db = loadDb();
      if (!where || Object.keys(where).length === 0) {
        const count = (db[collectionName] || []).length;
        db[collectionName] = [];
        scheduleSave();
        return { count };
      }

      const initialLength = (db[collectionName] || []).length;
      db[collectionName] = (db[collectionName] || []).filter((it) => !matchesWhere(it, where));
      const count = initialLength - db[collectionName].length;
      if (count > 0) scheduleSave();
      return { count };
    },

    async count(args = {}) {
      const { where } = args;
      const db = loadDb();
      const list = db[collectionName] || [];
      if (!where) return list.length;
      return list.filter((it) => matchesWhere(it, where)).length;
    },
  };
}

function applyOrderBy(list, orderBy) {
  if (!orderBy) return;
  const entries = Array.isArray(orderBy) ? orderBy : [orderBy];

  list.sort((a, b) => {
    for (const rule of entries) {
      for (const [key, dir] of Object.entries(rule)) {
        const valA = a[key];
        const valB = b[key];
        if (valA === valB) continue;
        if (dir === "desc") {
          return valA > valB ? -1 : 1;
        } else {
          return valA > valB ? 1 : -1;
        }
      }
    }
    return 0;
  });
}

function resolveIncludes(item, include, relationsConfig) {
  if (!include || typeof include !== "object") return { ...item };

  const db = loadDb();
  const result = { ...item };

  for (const [relName, relOption] of Object.entries(include)) {
    if (!relOption) continue;
    const config = relationsConfig[relName];
    if (!config) continue;

    const targetList = db[config.collection] || [];

    if (config.type === "hasMany") {
      let filtered = targetList.filter((target) => target[config.foreignKey] === item[config.localKey]);
      if (typeof relOption === "object") {
        if (relOption.where) {
          filtered = filtered.filter((t) => matchesWhere(t, relOption.where));
        }
        if (relOption.orderBy) {
          applyOrderBy(filtered, relOption.orderBy);
        }
        if (relOption.select) {
          filtered = filtered.map((t) => applySelect(t, relOption.select));
        }
      }
      result[relName] = filtered;
    } else if (config.type === "belongsTo") {
      let matched = targetList.find((target) => target[config.localKey] === item[config.foreignKey]) || null;
      if (matched && typeof relOption === "object" && relOption.select) {
        matched = applySelect(matched, relOption.select);
      }
      result[relName] = matched;
    }
  }

  return result;
}

// Prisma-compatible interface for Management-System
export const dummyPrisma = {
  user: createModelHandler("users", {
    attendance: { type: "hasMany", collection: "attendance", foreignKey: "userId", localKey: "id" },
    assignedTasks: { type: "hasMany", collection: "tasks", foreignKey: "assignedToId", localKey: "id" },
    createdTasks: { type: "hasMany", collection: "tasks", foreignKey: "createdById", localKey: "id" },
    leaveRequests: { type: "hasMany", collection: "leaveRequests", foreignKey: "userId", localKey: "id" },
    callRecords: { type: "hasMany", collection: "callRecords", foreignKey: "salesPersonId", localKey: "id" },
  }),

  attendance: createModelHandler("attendance", {
    user: { type: "belongsTo", collection: "users", foreignKey: "userId", localKey: "id" },
  }),

  task: createModelHandler("tasks", {
    assignedTo: { type: "belongsTo", collection: "users", foreignKey: "assignedToId", localKey: "id" },
    createdBy: { type: "belongsTo", collection: "users", foreignKey: "createdById", localKey: "id" },
  }),

  leaveRequest: createModelHandler("leaveRequests", {
    user: { type: "belongsTo", collection: "users", foreignKey: "userId", localKey: "id" },
  }),

  client: createModelHandler("clients", {
    ClientDelivery: { type: "hasMany", collection: "clientDeliveries", foreignKey: "clientId", localKey: "clientId" },
    ClientTask: { type: "hasMany", collection: "clientTasks", foreignKey: "clientId", localKey: "clientId" },
    ClientFeedback: { type: "hasMany", collection: "clientFeedback", foreignKey: "clientId", localKey: "clientId" },
    RenewalRequest: { type: "hasMany", collection: "renewalRequests", foreignKey: "clientId", localKey: "clientId" },
  }),

  clientDelivery: createModelHandler("clientDeliveries", {
    Client: { type: "belongsTo", collection: "clients", foreignKey: "clientId", localKey: "clientId" },
  }),

  clientTask: createModelHandler("clientTasks", {
    Client: { type: "belongsTo", collection: "clients", foreignKey: "clientId", localKey: "clientId" },
  }),

  plan: createModelHandler("plans"),
  clientFeedback: createModelHandler("clientFeedback"),
  callRecord: createModelHandler("callRecords", {
    salesPerson: { type: "belongsTo", collection: "users", foreignKey: "salesPersonId", localKey: "id" },
  }),
  renewalRequest: createModelHandler("renewalRequests", {
    client: { type: "belongsTo", collection: "clients", foreignKey: "clientDbId", localKey: "id" },
  }),
  auditLog: createModelHandler("auditLogs"),
};

// SQL query emulator for mysql2 pool queries in AiDigitalWeb
export async function mockSqlQuery(sqlString, params = []) {
  const db = loadDb();
  const trimmed = sqlString.trim().replace(/;$/, "");
  const upper = trimmed.toUpperCase();

  // Handle DDL (CREATE TABLE, ALTER TABLE, DROP TABLE) silently
  if (
    upper.startsWith("CREATE TABLE") ||
    upper.startsWith("ALTER TABLE") ||
    upper.startsWith("DROP TABLE") ||
    upper.startsWith("SET ")
  ) {
    return [{ affectedRows: 0, insertId: 0 }, []];
  }

  // SELECT queries
  if (upper.startsWith("SELECT")) {
    if (upper.includes("FROM WEBSITE_VISITORS") || upper.includes("FROM `WEBSITE_VISITORS`")) {
      const visitors = db.website_visitors || [];
      if (upper.includes("COUNT(DISTINCT") || upper.includes("COUNT(*)")) {
        const count = visitors.length;
        return [[{ total_visitors: count, total_sessions: count, total_pageviews: count * 3, count: count }], []];
      }
      return [visitors, []];
    }

    if (upper.includes("FROM PRICING_PLANS") || upper.includes("FROM `PRICING_PLANS`")) {
      return [db.pricing_plans || [], []];
    }

    if (upper.includes("FROM PORTFOLIO_ITEMS") || upper.includes("FROM `PORTFOLIO_ITEMS`")) {
      let items = db.portfolio_items || [];
      if (params && params.length > 0 && upper.includes("WHERE SECTION = ?")) {
        items = items.filter((i) => i.section === params[0]);
      }
      return [items, []];
    }

    if (upper.includes("FROM BLOGS") || upper.includes("FROM `BLOGS`")) {
      let blogs = db.blogs || [];
      if (upper.includes("WHERE SLUG = ?")) {
        blogs = blogs.filter((b) => b.slug === params[0]);
      }
      return [blogs, []];
    }

    if (upper.includes("FROM SITE_VISIBILITY") || upper.includes("FROM `SITE_VISIBILITY`")) {
      return [db.visibility_items || [], []];
    }

    if (upper.includes("FROM JOB_APPLICATIONS") || upper.includes("FROM `JOB_APPLICATIONS`")) {
      return [db.job_applications || [], []];
    }

    if (upper.includes("FROM ONBOARDING_DETAILS") || upper.includes("FROM `ONBOARDING_DETAILS`")) {
      return [db.onboarding_details || [], []];
    }

    if (upper.includes("FROM WHATSAPP_LOGS") || upper.includes("FROM `WHATSAPP_LOGS`")) {
      return [db.whatsapp_logs || [], []];
    }

    if (upper.includes("FROM CHECKOUT_EXIT_FEEDBACK") || upper.includes("FROM `CHECKOUT_EXIT_FEEDBACK`")) {
      return [db.checkout_exit_feedback || [], []];
    }

    return [[], []];
  }

  // INSERT queries
  if (upper.startsWith("INSERT INTO")) {
    if (upper.includes("WEBSITE_VISITORS")) {
      if (!db.website_visitors) db.website_visitors = [];
      const newRec = {
        id: db.website_visitors.length + 1,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      };
      db.website_visitors.push(newRec);
      scheduleSave();
      return [{ affectedRows: 1, insertId: newRec.id }, []];
    }

    if (upper.includes("JOB_APPLICATIONS")) {
      if (!db.job_applications) db.job_applications = [];
      const newRec = {
        id: db.job_applications.length + 1,
        name: params[0] || "",
        email: params[1] || "",
        phone: params[2] || "",
        address: params[3] || "",
        city: params[4] || "",
        district: params[5] || "",
        job_title: params[6] || "",
        message: params[7] || "",
        resume_url: params[8] || "",
        status: "Pending",
        created_at: new Date().toISOString(),
      };
      db.job_applications.push(newRec);
      scheduleSave();
      return [{ affectedRows: 1, insertId: newRec.id }, []];
    }

    if (upper.includes("BLOGS")) {
      if (!db.blogs) db.blogs = [];
      const newRec = {
        id: params[0] || `b_${Date.now()}`,
        title: params[1] || "",
        slug: params[2] || "",
        content: params[3] || "",
        excerpt: params[4] || "",
        cover_image: params[5] || "",
        category: params[6] || "Marketing",
        published: params[7] || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.blogs.push(newRec);
      scheduleSave();
      return [{ affectedRows: 1, insertId: 1 }, []];
    }

    if (upper.includes("ONBOARDING_DETAILS")) {
      if (!db.onboarding_details) db.onboarding_details = [];
      const newRec = {
        id: db.onboarding_details.length + 1,
        created_at: new Date().toISOString(),
      };
      db.onboarding_details.push(newRec);
      scheduleSave();
      return [{ affectedRows: 1, insertId: newRec.id }, []];
    }

    scheduleSave();
    return [{ affectedRows: 1, insertId: 1 }, []];
  }

  // UPDATE queries
  if (upper.startsWith("UPDATE")) {
    if (upper.includes("JOB_APPLICATIONS")) {
      const [status, id] = params;
      const app = (db.job_applications || []).find((a) => a.id === Number(id));
      if (app) app.status = status;
      scheduleSave();
      return [{ affectedRows: 1 }, []];
    }

    if (upper.includes("SITE_VISIBILITY")) {
      scheduleSave();
      return [{ affectedRows: 1 }, []];
    }

    scheduleSave();
    return [{ affectedRows: 1 }, []];
  }

  // DELETE queries
  if (upper.startsWith("DELETE FROM")) {
    if (upper.includes("JOB_APPLICATIONS") && params.length > 0) {
      db.job_applications = (db.job_applications || []).filter((a) => a.id !== Number(params[0]));
      scheduleSave();
      return [{ affectedRows: 1 }, []];
    }
    if (upper.includes("BLOGS") && params.length > 0) {
      db.blogs = (db.blogs || []).filter((b) => b.id !== params[0] && b.slug !== params[0]);
      scheduleSave();
      return [{ affectedRows: 1 }, []];
    }
    scheduleSave();
    return [{ affectedRows: 1 }, []];
  }

  return [[], []];
}
