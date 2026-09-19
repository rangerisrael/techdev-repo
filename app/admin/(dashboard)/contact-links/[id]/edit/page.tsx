import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactLinkForm } from "@/components/admin/contact-link-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteContactLink, updateContactLink } from "../../actions";

export default async function EditContactLinkPage(
  props: PageProps<"/admin/contact-links/[id]/edit">
) {
  const { id } = await props.params;
  const contactLink = await getPortfolioAdminRepository().getContactLink(Number(id));
  if (!contactLink) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/contact-links"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Contact links
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit contact link</h1>
        <p className="text-sm text-muted-foreground">{contactLink.label}</p>
      </div>

      <ContactLinkForm
        contactLink={contactLink}
        action={updateContactLink}
        deleteAction={deleteContactLink}
      />
    </div>
  );
}
