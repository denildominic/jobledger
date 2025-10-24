import fs from "fs";
import path from "path";

// ✅ On Vercel the repo dir is read-only. /tmp is writable.
// Locally, still use ./data so it persists for you.
const baseDir = process.env.VERCEL ? "/tmp" : process.cwd();
const dataDir = path.join(baseDir, "data");
const usersFile = path.join(dataDir, "users.json");
const jobsFile = path.join(dataDir, "jobs.json");

function ensureDir() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  } catch {}
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(filePath: string, value: T) {
  ensureDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
  } catch {
    // swallow; API will reflect failure through unchanged reads
  }
}

export type User = {
  id: string;
  email: string;
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
  applyUrl?: string;
};

function uuid() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}

export const Store = {
  // Users
  getUsers(): User[] {
    return readJSON<User[]>(usersFile, []);
  },

  saveUsers(users: User[]) {
    writeJSON(usersFile, users);
  },

  getUserByEmail(email: string): User | undefined {
    if (!email) return undefined;
    return this.getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  findOrCreateUser(data: { name: string; email: string }): User {
    const users = this.getUsers();
    let u = users.find(
      (x) => x.email.toLowerCase() === data.email.toLowerCase()
    );
    if (!u) {
      u = {
        id: uuid(),
        email: data.email,
        name: data.name || "User",
        savedJobIds: [],
      };
      users.push(u);
      this.saveUsers(users);
    } else if (data.name && data.name !== u.name) {
      u.name = data.name;
      this.saveUsers(users);
    }
    return u;
  },

  addSavedJob(userId: string, jobId: string) {
    const users = this.getUsers();
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    const id = String(jobId);
    if (!u.savedJobIds.includes(id)) {
      u.savedJobIds.push(id);
      this.saveUsers(users);
    }
  },

  removeSavedJob(userId: string, jobId: string) {
    const users = this.getUsers();
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    const id = String(jobId);
    const next = u.savedJobIds.filter((x) => String(x) !== id);
    if (next.length !== u.savedJobIds.length) {
      u.savedJobIds = next;
      this.saveUsers(users);
    }
  },

  // Local jobs (normalized so UI always gets the Job shape)
  getJobs(): Job[] {
    const raw = readJSON<any[]>(jobsFile, []);
    return raw.map((r) => {
      const id = String(r.id ?? r.jobId ?? uuid());
      const postedAt = r.postedAt ?? r.posted ?? "";
      const applyUrl =
        r.applyUrl ?? r.redirect_url ?? r.url ?? undefined;

      const type =
        r.type ??
        (r.contract_type
          ? String(r.contract_type).replace(/_/g, " ")
          : "Full-time");

      const tags: string[] = Array.isArray(r.tags)
        ? r.tags
        : r.category?.label
        ? [r.category.label]
        : [];

      return {
        id,
        title: r.title ?? "",
        company: r.company ?? "Unknown",
        location: r.location ?? "—",
        type,
        tags,
        description: r.description ?? r.summary ?? "",
        salary: r.salary ?? "",
        postedAt,
        applyUrl,
      } as Job;
    });
  },
};
