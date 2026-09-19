import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteExperience, updateExperience } from "../../actions";

export default async function EditExperiencePage(
  props: PageProps<"/admin/experience/[id]/edit">
) {
  const { id } = await props.params;
  const entry = await getPortfolioAdminRepository().getExperience(Number(id));
  if (!entry) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/experience"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Experience
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit experience entry</h1>
        <p className="text-sm text-muted-foreground">{entry.role}</p>
      </div>

      <ExperienceForm entry={entry} action={updateExperience} deleteAction={deleteExperience} />
    </div>
  );
}
