import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function readJSON<T>(file: string, defaultValue: T): T {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return defaultValue;
  const raw = fs.readFileSync(p, 'utf8');
  try { return JSON.parse(raw) as T; } catch { return defaultValue; }
}

function writeJSON<T>(file: string, value: T) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(value, null, 2), 'utf8');
}

export type User = {
  id: string;
  email: string;
  password: string; // dev only
  name: string;
  savedJobIds: string[];
}

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
}

export const Store = {
  getUsers(): User[] { return readJSON<User[]>('users.json', []); },
  saveUsers(users: User[]) { writeJSON('users.json', users); },

  getJobs(): Job[] { return readJSON<Job[]>('jobs.json', []); },
};
