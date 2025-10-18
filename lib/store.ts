// lib/store.ts
import fs from "fs";
import path from "path";

const IS_VERCEL = !!process.env.VERCEL;
const dataDir = path.join(process.cwd(), "data");
if (!IS_VERCEL) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
}

function readJSON<T>(file: string, def: T): T {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return def;
  try { return JSON.parse(fs.readFileSync(p, "utf8")) as T; } catch { return def; }
}
function writeJSON<T>(file: string, v: T) {
  if (IS_VERCEL) return;
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(v, null, 2), "utf8");
}

export type User = {
  id: string;
  email: string;
  password?: string;
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
  // USERS
  getUsers(): User[] { return readJSON<User[]>("users.json", []); },
  saveUsers(users: User[]) { writeJSON("users.json", users); },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  },

  findOrCreateUser(data: { name: string; email: string }): User {
    if (!IS_VERCEL) {
      const users = this.getUsers();
      let u = users.find(x => x.email === data.email);
      if (!u) {
        u = {
          id: (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2),
          name: data.name,
          email: data.email,
          savedJobIds: [],
        };
        users.push(u);
        this.saveUsers(users);
      }
      return u;
    }
    // stateless fabrication for serverless
    return {
      id: `vercel-${Buffer.from(data.email).toString("hex").slice(0, 12)}`,
      name: data.name,
      email: data.email,
      savedJobIds: [],
    };
  },

  addSavedJob(userId: string, jobId: string) {
    if (IS_VERCEL) return; // no-op in prod
    const users = this.getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return;
    u.savedJobIds = Array.from(new Set([...(u.savedJobIds ?? []), String(jobId)]));
    this.saveUsers(users);
  },

  removeSavedJob(userId: string, jobId: string) {
    if (IS_VERCEL) return; // no-op in prod
    const users = this.getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return;
    u.savedJobIds = (u.savedJobIds ?? []).filter(id => id !== String(jobId));
    this.saveUsers(users);
  },

  // JOBS
  getJobs(): Job[] { return readJSON<Job[]>("jobs.json", []); },
};
