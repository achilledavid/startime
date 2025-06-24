CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"title" text,
	"description" text,
	"url" text,
	"created_at" timestamp NOT NULL,
	"size" text,
	CONSTRAINT "resources_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;