"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  endpoint?: string;
  redirectTo?: Route;
  className?: string;
}

export function LogoutButton({
  endpoint = "/api/v1/admin/logout",
  redirectTo = "/admin/login" as Route,
  className = "text-sm text-secondary-text hover:text-gold",
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch(endpoint, { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={className}>
      Sign Out
    </button>
  );
}
