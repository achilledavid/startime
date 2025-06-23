import { member as memberSchema, onboarding, steps } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { publicProcedure, router } from "@/server/trpc";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { getOnboarding, postOnboarding } from '@/schemas/onboarding';

export const onboardingRouter = router({
    get: publicProcedure.input(getOnboarding).query(async (opts) => {
        const { input } = opts;
        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new Error("User is not authenticated");
        }

        const transaction = await db.transaction(async (tx) => {
            const onboard = await db
                .select()
                .from(onboarding)
                .where(eq(onboarding.organizationId, member[0].organizationId))
                .limit(1);

            if (onboard.length === 0) {
                return null;
            }

            const stepsData = await tx
                .select()
                .from(steps)
                .where(eq(steps.onboardingId, onboard[0].id))
                .orderBy(steps.order);

            return {
                data: onboard[0],
                steps: stepsData,
            };
        });

        if (!transaction) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Onboarding not found" });
        }

        return transaction;
    }),

    post: publicProcedure.input(postOnboarding).mutation(async (opts) => {
        const { input } = opts;
        const member = await auth.api.getActiveMember();

        if (!member) {
            throw new Error("User is not authenticated");
        }

        const existingOnboarding = await db
            .select()
            .from(onboarding)
            .where(eq(onboarding.organizationId, member.organizationId))
            .limit(1);

        if (existingOnboarding.length > 0) {
            throw new TRPCError({ code: "CONFLICT", message: "Onboarding already exists" });
        }

        const transaction = await db.transaction(async (tx) => {
            const [newOnboarding] = await tx.insert(onboarding).values({
                organizationId: member.organizationId,
                title: input.title,
                description: input.description,
            }).returning();

            const stepsToInsert = input.steps.map((step, index) => ({
                onboardingId: newOnboarding.id,
                title: step.title,
                description: step.description,
                order: step.order,
                type: step.type,
                checklistId: step.checklist ? null : undefined, // Set to null if no checklist
            }));

            if (input.steps.length === 0) {
                tx.rollback();
                throw new TRPCError({
                    code: "BAD_REQUEST", message: "At least one step is required"
                });
            }

            const insertedSteps = tx.insert(steps).values(stepsToInsert).returning();

            return {
                onboarding: newOnboarding,
                steps: insertedSteps,
            }
        })

        return transaction
    })
});

type RouterOutput = inferRouterOutputs<typeof onboardingRouter>;
export type Onboarding = RouterOutput['get'];