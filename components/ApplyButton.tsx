// app/components/ApplyButton.tsx

"use client";
import Link from "next/link";

export default function ApplyButton({
  href,
  className = "",
}: {
  href?: string | null;
  className?: string;
}) {
  if (!href) return null;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`btn ${className}`}
      aria-label="Apply to this job"
    >
      Apply
    </Link>
  );
}
