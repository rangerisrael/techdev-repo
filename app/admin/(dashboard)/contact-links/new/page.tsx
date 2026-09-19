import Link from "next/link";
import { ContactLinkForm } from "@/components/admin/contact-link-form";

import { createContactLink } from "../actions";

export default function NewContactLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/contact-links"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Contact links
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New contact link</h1>
      </div>

      <ContactLinkForm action={createContactLink} />
    </div>
  );
}
