"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({
  className = "btn-outline",
  redirectTo = "/",
}: {
  className?: string;
  redirectTo?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // 1) clear our custom JWT cookie
      await fetch("/api/logout", { method: "POST" }).catch(() => {});

      // 2) sign out NextAuth (clears next-auth session cookies)
      await signOut({ callbackUrl: redirectTo });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button className={className} onClick={onClick} disabled={busy}>
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}
