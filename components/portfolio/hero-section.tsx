import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/portfolio/fade-in";
import { StatusPanel } from "@/components/portfolio/status-panel";
import type { SiteConfig, StatusItem } from "@/lib/types/portfolio";

interface HeroSectionProps {
  config: SiteConfig;
  statusItems: StatusItem[];
}

export function HeroSection({ config, statusItems }: HeroSectionProps) {
  return (
    <header className="grid grid-cols-1 items-start gap-12 py-14 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
      <FadeIn>
        <p className="mb-4.5 font-mono text-[13px] text-amber">{config.kicker}</p>
        <h1 className="mb-5 font-serif text-[42px] font-medium leading-[1.05] tracking-[-0.01em] sm:text-[56px] lg:text-[68px]">
          {config.headline}
        </h1>
        <p className="mb-8 max-w-[46ch] text-lg text-muted-foreground">
          {config.subheadline}
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a
            href={config.primaryCta.href}
            className={buttonVariants({
              className:
                "h-auto rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/85",
            })}
          >
            {config.primaryCta.label}
          </a>
          <a
            href={config.secondaryCta.href}
            className={buttonVariants({
              variant: "outline",
              className:
                "h-auto rounded-md border-line bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary",
            })}
          >
            {config.secondaryCta.label}
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <StatusPanel items={statusItems} />
      </FadeIn>
    </header>
  );
}
