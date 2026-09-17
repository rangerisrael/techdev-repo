import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactNote as staticContactNote,
  siteConfig as staticSiteConfig,
} from "@/lib/data/portfolio-data";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { saveSiteConfig } from "./actions";

export default async function SiteConfigPage() {
  const row = await getPortfolioAdminRepository().getSiteConfig();

  const values = row
    ? {
        brand: row.brand,
        kicker: row.kicker,
        headline: row.headline,
        subheadline: row.subheadline,
        primaryCtaLabel: row.primaryCtaLabel,
        primaryCtaHref: row.primaryCtaHref,
        secondaryCtaLabel: row.secondaryCtaLabel,
        secondaryCtaHref: row.secondaryCtaHref,
        footerNote: row.footerNote,
        contactNote: row.contactNote,
      }
    : {
        brand: staticSiteConfig.brand,
        kicker: staticSiteConfig.kicker,
        headline: staticSiteConfig.headline,
        subheadline: staticSiteConfig.subheadline,
        primaryCtaLabel: staticSiteConfig.primaryCta.label,
        primaryCtaHref: staticSiteConfig.primaryCta.href,
        secondaryCtaLabel: staticSiteConfig.secondaryCta.label,
        secondaryCtaHref: staticSiteConfig.secondaryCta.href,
        footerNote: staticSiteConfig.footerNote,
        contactNote: staticContactNote,
      };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Site config
        </h1>
        <p className="text-sm text-muted-foreground">
          {row
            ? "Editing the live database row."
            : "No row saved yet — showing the static fallback content. Saving creates the row."}
        </p>
      </div>

      <form
        action={saveSiteConfig}
        className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-4"
      >
        <Field label="Brand" name="brand" defaultValue={values.brand} />
        <Field label="Kicker" name="kicker" defaultValue={values.kicker} />
        <Field
          label="Headline"
          name="headline"
          defaultValue={values.headline}
        />
        <FieldArea
          label="Subheadline"
          name="subheadline"
          defaultValue={values.subheadline}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Primary CTA label"
            name="primaryCtaLabel"
            defaultValue={values.primaryCtaLabel}
          />
          <Field
            label="Primary CTA href"
            name="primaryCtaHref"
            defaultValue={values.primaryCtaHref}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Secondary CTA label"
            name="secondaryCtaLabel"
            defaultValue={values.secondaryCtaLabel}
          />
          <Field
            label="Secondary CTA href"
            name="secondaryCtaHref"
            defaultValue={values.secondaryCtaHref}
          />
        </div>
        <Field
          label="Footer note"
          name="footerNote"
          defaultValue={values.footerNote}
        />
        <FieldArea
          label="Contact note"
          name="contactNote"
          defaultValue={values.contactNote}
        />
        <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} required />
    </div>
  );
}

function FieldArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required
        rows={3}
      />
    </div>
  );
}
