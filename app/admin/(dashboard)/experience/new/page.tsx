import Link from "next/link";
import { ExperienceForm } from "@/components/admin/experience-form";

import { createExperience } from "../actions";

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/experience"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Experience
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New experience entry</h1>
      </div>

      <ExperienceForm action={createExperience} />
    </div>
  );
}
