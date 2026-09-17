import { FadeIn } from "@/components/portfolio/fade-in";
import { SectionHeading } from "@/components/portfolio/section-heading";
import type { ContactLink } from "@/lib/types/portfolio";

interface ContactSectionProps {
  note: string;
  links: ContactLink[];
}

export function ContactSection({ note, links }: ContactSectionProps) {
  return (
    <section id="contact" className="border-t border-line py-16 sm:py-[72px]">
      <SectionHeading number="04" title="Let's talk" />
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[44ch] text-muted-foreground">{note}</p>
          <div className="flex flex-wrap gap-5 font-mono text-sm">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="border-b border-line pb-0.5 text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
