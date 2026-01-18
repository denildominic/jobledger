"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try {
        await fetch("/api/logout", { method: "POST" });
      } catch {}
      await signOut({ callbackUrl: "/" });
    })();
  }, []);

  return (
    <main className="container py-10">
      <p>Signing you out.</p>
    </main>
  );
}
