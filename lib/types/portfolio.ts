export interface NavLink {
  label: string;
  href: string;
}

export interface StatusItem {
  label: string;
  value: string;
}

export interface StackLayer {
  layer: string;
  title: string;
  tags: string[];
  wide?: boolean;
}

export interface Project {
  year: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ExperienceItem {
  date: string;
  role: string;
  description: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  brand: string;
  kicker: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  footerNote: string;
}
