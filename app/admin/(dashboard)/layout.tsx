import Link from "next/link";
import type { ReactNode } from "react";

import { SubmitButton } from "@/components/admin/submit-button";
import { requireAdminSession } from "@/lib/auth/dal";
import { getContactMessageRepository } from "@/lib/db/repositories";

import { logout } from "../login/actions";

const sections = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/site-config", label: "Site config" },
  { href: "/admin/nav-links", label: "Nav links" },
  { href: "/admin/status-items", label: "Status items" },
  { href: "/admin/stack-layers", label: "Stack layers" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/contact-links", label: "Contact links" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminSession();

  let unreadCount = 0;
  try {
    unreadCount = (await getContactMessageRepository().list()).filter(
      (message) => !message.read
    ).length;
  } catch (error) {
    console.warn(
      "[admin] failed to load unread message count:",
      error instanceof Error ? error.message : error
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground sm:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 border-b border-border p-4 sm:w-56 sm:border-r sm:border-b-0">
        <p className="mb-2 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Admin
        </p>
        <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              {section.label}
              {section.href === "/admin/messages" && unreadCount > 0 ? (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <form action={logout} className="pt-4 sm:mt-auto">
          <SubmitButton
            variant="outline"
            size="sm"
            className="w-full"
            pendingLabel="Logging out…"
          >
            Log out
          </SubmitButton>
        </form>
      </aside>
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
