import type {
  ContactLink,
  ExperienceItem,
  NavLink,
  Project,
  SiteConfig,
  StackLayer,
  StatusItem,
} from "@/lib/types/portfolio";

export const siteConfig: SiteConfig = {
  brand: "techdev",
  kicker: "// full-stack developer, based in the Philippines",
  headline: "Israel builds the systems behind the interface.",
  subheadline:
    "I work across the stack — React and Next.js on the front end, Node.js and TypeScript services underneath, backed by Postgres, Redis, and BullMQ doing the actual work in the background.",
  primaryCta: { label: "See recent work", href: "#work" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
  footerNote: "built with Node, React, and too much coffee",
};

export const navLinks: NavLink[] = [
  { label: "stack", href: "#stack" },
  { label: "work", href: "#work" },
  { label: "experience", href: "#experience" },
  { label: "contact", href: "#contact" },
];

export const statusItems: StatusItem[] = [
  { label: "role", value: "Full-Stack Developer" },
  { label: "focus", value: "marketplace platforms" },
  { label: "backend", value: "Node · Express · TS" },
  { label: "infra", value: "AWS · CI/CD" },
  { label: "availability", value: "open to opportunities" },
];

export const stackLayers: StackLayer[] = [
  {
    layer: "client",
    title: "Interface layer",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    layer: "service",
    title: "Application layer",
    tags: ["Node.js", "Express", "Drizzle ORM"],
  },
  {
    layer: "data + jobs",
    title: "Persistence & queues",
    tags: ["PostgreSQL", "Redis", "BullMQ"],
  },
  {
    layer: "infrastructure",
    title: "Deployment & operations",
    tags: ["AWS", "CI/CD pipelines", "Staging & production environments"],
    wide: true,
  },
];

export const projects: Project[] = [
  {
    year: "2024 — ongoing",
    category: "Marketplace platform",
    title: "Scrub.ph",
    description:
      "A Philippine-based cleaning services marketplace connecting customers with service providers. Worked across the full stack — backend architecture, payment flows, the customer- and provider-facing frontend, and the AWS deployment pipeline for staging and production.",
    tags: ["Node.js", "Express", "PostgreSQL", "React", "AWS"],
  },
  {
    year: "—",
    category: "Project",
    title: "Add your next project here",
    description:
      "A short line on the problem it solved, your role, and the outcome. Keep it concrete — what shipped, and what it's made of.",
    tags: ["stack tag one", "stack tag two"],
  },
];

export const experience: ExperienceItem[] = [
  {
    date: "2024 — Present",
    role: "Full-Stack Developer, Scrub Technologies Inc.",
    description:
      "Building and maintaining Scrub.ph end to end: backend services, payment integration, frontend, and the deployment pipeline across staging and production on AWS.",
  },
  {
    date: "Add earlier role",
    role: "Role, Company",
    description: "What you owned and shipped there.",
  },
];

export const contactLinks: ContactLink[] = [
  { label: "email", href: "mailto:you@example.com" },
  { label: "github", href: "#" },
  { label: "linkedin", href: "#" },
];

export const contactNote =
  "Open to full-stack roles and freelance work — especially where backend systems, marketplaces, or infrastructure are the interesting part of the problem.";
