"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "700", // pick what you use
  display: "swap",
});

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container py-3 flex items-center gap-4">
        <Link
          href="/"
          className={`${fredoka.className} text-2xl md:text-3xl font-black tracking-tight`}
        >
          JobLedger
        </Link>
        <nav className="ml-auto flex items-center gap-3">
          <Link href="/jobs" className="btn-outline">
            Jobs
          </Link>
          <Link href="/resume-match" className="btn-outline">
            Resume Match
          </Link>
          <Link href="/dashboard" className="btn">
            Dashboard
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="btn-outline"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
