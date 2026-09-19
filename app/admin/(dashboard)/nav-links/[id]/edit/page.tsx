import Link from "next/link";
import { notFound } from "next/navigation";
import { NavLinkForm } from "@/components/admin/nav-link-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteNavLink, updateNavLink } from "../../actions";

export default async function EditNavLinkPage(
  props: PageProps<"/admin/nav-links/[id]/edit">
) {
  const { id } = await props.params;
  const navLink = await getPortfolioAdminRepository().getNavLink(Number(id));
  if (!navLink) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/nav-links"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Nav links
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit nav link</h1>
        <p className="text-sm text-muted-foreground">{navLink.label}</p>
      </div>

      <NavLinkForm navLink={navLink} action={updateNavLink} deleteAction={deleteNavLink} />
    </div>
  );
}
