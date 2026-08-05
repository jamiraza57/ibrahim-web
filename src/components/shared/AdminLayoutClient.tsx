"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/shared/AdminSidebar";
import { LogoutButton } from "@/components/shared/LogoutButton";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar />
      <div className="flex-1">
        <header className="hidden justify-end border-b border-gold/10 px-8 py-4 lg:flex">
          <LogoutButton />
        </header>
        {children}
      </div>
    </div>
  );
}
