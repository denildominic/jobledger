AI Job Finder

A modern, full‑stack web app that helps people discover roles they love, instantly scan postings against their resume, and apply with confidence. It includes authentication, a beautiful dashboard, dark/light themes, a fast job search with filters, and an AI‑powered Resume Match that scores fit against any job title or description.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Prisma, and your choice of job + AI providers.

✨ Features

Secure Auth – OAuth (Google/GitHub) or email magic link via NextAuth.

Job Search – Query by keyword/location; filter by salary, remote/on‑site, experience.

Apply Flow – Open application links, save jobs, track statuses (Saved → Applied → Interview → Offer → Rejected).

Resume Match (AI) – Upload a resume (PDF/DOCX) and enter any job title/description to get an instant match score with strengths & gaps.

Smart Dashboard – Recent searches, saved jobs, applications timeline, and reminders.

Dark/Light Mode – System‑aware theme with smooth toggles.

Responsive UI – Accessible, keyboard‑friendly, mobile‑first.

🧱 Tech Stack

Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react

Backend: Next.js Route Handlers (API), Prisma ORM

Database: PostgreSQL (Neon/Supabase/Railway/PlanetScale\*), SQLite for local dev

Auth: NextAuth (Auth.js) – Google/GitHub providers or Email

Storage: Local (dev) or S3/Cloudinary for resumes

AI: Embeddings + scoring (OpenAI or compatible)

Job Data: Choose one provider (e.g., JSearch on RapidAPI, Remotive, Adzuna, or a custom source)

PlanetScale is MySQL; Prisma supports both. Use Postgres for simplicity unless you prefer MySQL.
