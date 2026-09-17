import { ContactSection } from "@/components/portfolio/contact-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteNav } from "@/components/portfolio/site-nav";
import { StackSection } from "@/components/portfolio/stack-section";
import {
  contactLinks,
  contactNote,
  experience,
  navLinks,
  projects,
  siteConfig,
  stackLayers,
  statusItems,
} from "@/lib/data/portfolio-data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav brand={siteConfig.brand} links={navLinks} />
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8">
        <HeroSection config={siteConfig} statusItems={statusItems} />
        <StackSection layers={stackLayers} />
        <ProjectsSection projects={projects} />
        <ExperienceSection items={experience} />
        <ContactSection note={contactNote} links={contactLinks} />
        <SiteFooter note={siteConfig.footerNote} />
      </div>
    </div>
  );
}
