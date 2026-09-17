import Link from "next/link";

import { checkDatabaseConnection } from "@/lib/db/check-connection";

const sections = [
  {
    href: "/admin/site-config",
    label: "Site config",
    description: "Brand, headline, CTAs, footer & contact note.",
  },
  {
    href: "/admin/nav-links",
    label: "Nav links",
    description: "Header navigation links.",
  },
  {
    href: "/admin/status-items",
    label: "Status items",
    description: "Hero status strip.",
  },
  {
    href: "/admin/stack-layers",
    label: "Stack layers",
    description: "The stack diagram.",
  },
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Work section entries.",
  },
  {
    href: "/admin/experience",
    label: "Experience",
    description: "Career timeline entries.",
  },
  {
    href: "/admin/contact-links",
    label: "Contact links",
    description: "Contact section links.",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Submissions from the public contact form.",
  },
];

export default async function AdminHomePage() {
  const connection = await checkDatabaseConnection();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Portfolio content
        </h1>
        <p className="text-sm text-muted-foreground">
          Edits here write straight to Supabase and go live on the public
          site immediately.
        </p>
      </div>

      <div
        className={
          connection.connected
            ? "rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
            : "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        }
      >
        {connection.connected
          ? "Database connected."
          : `Database unreachable: ${connection.error}. The public site is showing its static fallback content until this is fixed.`}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
          >
            <p className="font-medium text-foreground">{section.label}</p>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
