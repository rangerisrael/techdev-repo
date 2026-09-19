import Link from "next/link";
import { NavLinkForm } from "@/components/admin/nav-link-form";

import { createNavLink } from "../actions";

export default function NewNavLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/nav-links"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Nav links
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New nav link</h1>
      </div>

      <NavLinkForm action={createNavLink} />
    </div>
  );
}
