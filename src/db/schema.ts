import { pgTable, text, timestamp, boolean, pgEnum, integer, check, serial, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = pgTable("session", {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	activeOrganizationId: text('active_organization_id')
});

export const account = pgTable("account", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const organization = pgTable("organization", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	logo: text('logo'),
	createdAt: timestamp('created_at').notNull(),
	metadata: text('metadata'),
	color: text('color').default("oklch(0.205 0 0)").notNull(),
});

export const member = pgTable("member", {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default("member").notNull(),
	createdAt: timestamp('created_at').notNull()
});

export const invitation = pgTable("invitation", {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	status: text('status').default("pending").notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const onboarding = pgTable("onboarding", {
	id: serial('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
});

export const stepsTypes = pgEnum('steps_types', ['document', 'video', 'checklist']);

export const checklist = pgTable("checklist", {
	id: serial('id').primaryKey(),
	answers: jsonb('answers').notNull(),
});

export const step = pgTable(
	"step",
	{
		id: serial('id').primaryKey(),
		onboardingId: integer('onboardingId').notNull().references(() => onboarding.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		description: text('description').notNull(),
		order: integer('order').notNull(),
		type: stepsTypes().notNull(),
		checklistId: integer('checklistId').references(() => checklist.id, { onDelete: 'set null' }),
		value: text('value'),
		duration: integer('duration').default(0).notNull(),
	},
	(table) => [
		check('checklist_id_not_null_check', sql`(${table.type} <> 'checklist' OR ${table.checklistId} IS NOT NULL)`)
	]
);

export const onboardingResponse = pgTable("onboarding_response", {
	id: serial('id').primaryKey(),
	onboardingId: integer('onboardingId').notNull().references(() => onboarding.id, { onDelete: 'cascade' }),
	memberId: text('memberId').notNull().references(() => member.id, { onDelete: 'cascade' }),
	value: jsonb('value').notNull(),
	createdAt: timestamp('createdAt').notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updatedAt').notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
	completed: boolean('completed').$defaultFn(() => false).notNull(),
});


export const resources = pgTable("resources", {
	id: serial('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	title: text("title").notNull(),
	description: text("description"),
	url: text("url").notNull().unique(),
	createdAt: timestamp('created_at').notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
	size: text("size")
});



export type Step = typeof step.$inferSelect;