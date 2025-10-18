// lib/store.ts
import fs from "fs";
import path from "path";

const IS_VERCEL = !!process.env.VERCEL; // serverless: don't write to disk
const dataDir = path.join(process.cwd(), "data");
if (!IS_VERCEL) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
}

function readJSON<T>(file: string, defaultValue: T): T {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return defaultValue;
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function writeJSON<T>(file: string, value: T) {
  if (IS_VERCEL) return; // no-op in prod
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(value, null, 2), "utf8");
}

export type User = {
  id: string;
  email: string;
  password?: string; // dev only
  name: string;
  savedJobIds: string[];
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  description: string;
  salary: string;
  postedAt: string;
};

export const Store = {
  // ----- USERS -----
  getUsers(): User[] { return readJSON<User[]>("users.json", []); },
  saveUsers(users: User[]) { writeJSON("users.json", users); },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  },

  findOrCreateUser(data: { name: string; email: string }): User {
    if (!IS_VERCEL) {
      const users = this.getUsers();
      let user = users.find(u => u.email === data.email);
      if (!user) {
        user = {
          id:
            (globalThis.crypto as any)?.randomUUID?.() ??
            Math.random().toString(36).slice(2),
          name: data.name,
          email: data.email,
          savedJobIds: [],
        };
        users.push(user);
        this.saveUsers(users);
      }
      return user;
    }
    // On Vercel (no persistent fs), fabricate a stable id
    return {
      id: `vercel-${Buffer.from(data.email).toString("hex").slice(0, 12)}`,
      name: data.name,
      email: data.email,
      savedJobIds: [],
    };
  },

  // ----- JOBS -----
  getJobs(): Job[] { return readJSON<Job[]>("jobs.json", []); },
};
