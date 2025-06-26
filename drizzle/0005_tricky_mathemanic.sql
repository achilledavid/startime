CREATE TYPE "public"."steps_types" AS ENUM('document', 'video', 'checklist');--> statement-breakpoint
CREATE TABLE "checklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"answers" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_response" (
	"id" serial PRIMARY KEY NOT NULL,
	"onboardingId" integer NOT NULL,
	"memberId" text NOT NULL,
	"value" jsonb NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"completed" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "step" (
	"id" serial PRIMARY KEY NOT NULL,
	"onboardingId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL,
	"type" "steps_types" NOT NULL,
	"checklistId" integer,
	"value" text,
	CONSTRAINT "checklist_id_not_null_check" CHECK (("step"."type" <> 'checklist' OR "step"."checklistId" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "color" text DEFAULT 'oklch(0.205 0 0)' NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding" ADD CONSTRAINT "onboarding_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_response" ADD CONSTRAINT "onboarding_response_onboardingId_onboarding_id_fk" FOREIGN KEY ("onboardingId") REFERENCES "public"."onboarding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_response" ADD CONSTRAINT "onboarding_response_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_onboardingId_onboarding_id_fk" FOREIGN KEY ("onboardingId") REFERENCES "public"."onboarding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_checklistId_checklist_id_fk" FOREIGN KEY ("checklistId") REFERENCES "public"."checklist"("id") ON DELETE set null ON UPDATE no action;