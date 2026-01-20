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
      <div className="container py-3 flex items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`${fredoka.className} text-2xl md:text-3xl font-black tracking-tight`}
          >
            JobLedger<span className="gradient-text">.</span>
          </span>
        </Link>

        {/* Desktop right cluster */}
        <div className="ml-auto hidden md:flex items-center gap-5">
          {/* Tabs as BUTTONS */}
          <nav
            className="flex items-center gap-2 rounded-xl border p-1"
            style={{
              borderColor: "rgb(var(--border))",
              background: "rgba(var(--fg), .02)",
            }}
          >
            {TABS.map((t) => {
              const active = pathname?.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "tab",
                    "px-4 py-2 rounded-lg font-semibold",
                    active ? "tab-active" : "",
                  ].join(" ")}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div
            className="h-7 w-px"
            style={{ background: "rgb(var(--border))", opacity: 0.7 }}
            aria-hidden
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/jobs" className="btn-ghost">
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

        {/* Mobile actions */}
        <div className="ml-auto md:hidden flex items-center gap-2">
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

      {/* Mobile tabs (also buttons) */}
      <div className="md:hidden container pb-3 -mt-1">
        <div
          className="flex gap-2 rounded-xl border p-1"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgba(var(--fg), .02)",
          }}
        >
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "tab",
                  "flex-1 text-center px-3 py-2 rounded-lg font-semibold",
                  active ? "tab-active" : "",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
