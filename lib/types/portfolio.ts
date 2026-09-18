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

export interface BlogReaction {
  emoji: string;
  count: number;
}

export interface BlogPost {
  /** Present only for DB-backed posts — gates the live comment/reaction UI. */
  id?: number;
  slug: string;
  badge?: string;
  author: { name: string; role?: string };
  date: string;
  title: string;
  tags: string[];
  reactions: number;
  comments: number;
  views: number;
  readTime: string;
  summary?: string;
  coverImageUrl?: string;
  reactionBreakdown?: BlogReaction[];
  body?: string[];
}

export interface BlogComment {
  id: number;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface BlogDiscussion {
  title: string;
  comments: number;
  href: string;
}

export interface BlogResource {
  title: string;
  href: string;
}
