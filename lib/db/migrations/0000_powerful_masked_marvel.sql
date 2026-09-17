CREATE TABLE "site_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"kicker" text NOT NULL,
	"headline" text NOT NULL,
	"subheadline" text NOT NULL,
	"primary_cta_label" text NOT NULL,
	"primary_cta_href" text NOT NULL,
	"secondary_cta_label" text NOT NULL,
	"secondary_cta_href" text NOT NULL,
	"footer_note" text NOT NULL,
	"contact_note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stack_layers" (
	"id" serial PRIMARY KEY NOT NULL,
	"layer" text NOT NULL,
	"title" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"wide" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"role" text NOT NULL,
	"description" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
