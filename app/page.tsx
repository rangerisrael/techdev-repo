import { ContactSection } from "@/components/portfolio/contact-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteNav } from "@/components/portfolio/site-nav";
import { StackSection } from "@/components/portfolio/stack-section";
import { getPortfolioRepository } from "@/lib/db/repositories";

export default async function Home() {
  const repo = getPortfolioRepository();
  const [
    siteConfig,
    navLinks,
    statusItems,
    stackLayers,
    projects,
    experience,
    contactLinks,
    contactNote,
  ] = await Promise.all([
    repo.getSiteConfig(),
    repo.getNavLinks(),
    repo.getStatusItems(),
    repo.getStackLayers(),
    repo.getProjects(),
    repo.getExperience(),
    repo.getContactLinks(),
    repo.getContactNote(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav brand={siteConfig.brand} links={navLinks} />
      <div className="mx-auto w-full max-w-275 px-6 sm:px-8">
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
