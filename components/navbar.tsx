"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const TABS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/resume-match", label: "Resume Match" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="header-blur">
      <div className="container py-3 flex items-center gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`${fredoka.className} text-2xl md:text-3xl font-black tracking-tight`}
          >
            Job<span className="gradient-text">Ledger</span>
          </span>
        </Link>

        {/* Tabs */}
        <nav className="ml-auto hidden md:flex items-center gap-1">
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`tab ${active ? "tab-active" : ""}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto md:ml-2 flex items-center gap-2">
          <Link href="/jobs" className="btn-ghost hidden sm:inline-flex">
            Browse Jobs
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="icon-btn"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden container pb-3 -mt-1 flex gap-1">
        {TABS.map((t) => {
          const active = pathname?.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`tab flex-1 text-center ${active ? "tab-active" : ""}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export default Navbar;
