import { member as memberSchema, onboarding, onboardingResponse, Step, step } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from "@/db";
import { publicProcedure, router } from "@/server/trpc";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { deleteOnboarding, getAllOnboardings, getOnboarding, getResponses, getUserOnboarding, postOnboarding, postResponse, putOnboarding } from '@/schemas/onboarding';

export const onboardingRouter = router({
    get: publicProcedure.input(getOnboarding).query(async (opts) => {
        const { input } = opts;

        const transaction = await db.transaction(async (tx) => {
            const onboard = await db
                .select()
                .from(onboarding)
                .where(eq(onboarding.id, input.onboardingId))
                .limit(1);

            if (onboard.length === 0) {
                return null;
            }

            const stepsData = await tx
                .select()
                .from(step)
                .where(eq(step.onboardingId, onboard[0].id))
                .orderBy(step.order);

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
        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        if (member[0].role !== "owner") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only owners can create onboarding steps"
            });
        }

        const transaction = await db.transaction(async (tx) => {
            const [newOnboarding] = await tx.insert(onboarding).values({
                organizationId: member[0].organizationId,
                title: input.title,
                description: input.description,
            }).returning();

            const stepsToInsert = input.steps.map(function (step) {
                return {
                    onboardingId: newOnboarding.id,
                    title: step.title,
                    description: step.description,
                    order: step.order,
                    type: step.type,
                    checklistId: step.checklistId ?? null,
                    value: step.value
                }
            });

            if (input.steps.length === 0) {
                tx.rollback();
                throw new TRPCError({
                    code: "BAD_REQUEST", message: "At least one step is required"
                });
            }

            const insertedSteps = await tx.insert(step).values(stepsToInsert).returning();

            return {
                onboarding: newOnboarding,
                steps: insertedSteps,
            }
        })

        return transaction

    }),

    put: publicProcedure.input(putOnboarding).mutation(async (opts) => {
        const { input } = opts;
        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        if (member[0].role !== "owner") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only owners can modify onboarding steps"
            });
        }

        const onboard = await db
            .select()
            .from(onboarding)
            .where(eq(onboarding.id, input.onBoardingId))
            .limit(1)


        if (!onboard[0]) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Onboarding not found"
            });
        }


        const transaction = await db.transaction(async (tx) => {
            const updatedOnboarding = await tx.update(onboarding).set({
                description: input.description,
                title: input.title
            }).returning()

            const stepsToUpdate = input.steps.map(function (step) {
                return {
                    id: step.id,
                    title: step.title,
                    description: step.description,
                    order: step.order,
                    type: step.type,
                    checklistId: step.checklistId ?? null,
                    value: step.value
                }
            });

            const stepsToReturn: Step[] = [];

            await Promise.all(stepsToUpdate.map(async (stepToUpdate) => {
                let tmp;
                if (stepToUpdate.id) {
                    tmp = await tx.update(step).set({
                        title: stepToUpdate.title,
                        description: stepToUpdate.description,
                        order: stepToUpdate.order,
                        type: stepToUpdate.type,
                        checklistId: stepToUpdate.checklistId,
                        value: stepToUpdate.value
                    }).where(eq(step.id, stepToUpdate.id)).returning()

                } else {
                    tmp = await tx.insert(step).values({
                        onboardingId: updatedOnboarding[0].id,
                        title: stepToUpdate.title,
                        description: stepToUpdate.description,
                        order: stepToUpdate.order,
                        type: stepToUpdate.type,
                        checklistId: stepToUpdate.checklistId ?? null,
                        value: stepToUpdate.value
                    }).returning()

                }

                stepsToReturn.push(tmp[0])
            }))

            return {
                onboarding: updatedOnboarding,
                steps: stepsToReturn,
            }
        })

        return transaction
    }),

    getAll: publicProcedure.input(getAllOnboardings).query(async (opts) => {
        const { input } = opts;

        const onboardings = await db
            .select()
            .from(onboarding)
            .where(eq(onboarding.organizationId, input.organizationId))
            .limit(input.limit)
            .offset(input.offset);

        console.log("Onboardings found:", onboardings);

        return onboardings;
    }),

    delete: publicProcedure.input(deleteOnboarding).mutation(async (opts) => {
        const { input } = opts;

        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        if (member[0].role !== "owner") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only owners can delete onboardings"
            });
        }

        const deletedOnboarding = await db
            .delete(onboarding)
            .where(eq(onboarding.id, input.onboardingId))
            .returning();

        if (deletedOnboarding.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Onboarding not found"
            });
        }

        return deletedOnboarding[0];
    }),

    getUserOnboarding: publicProcedure.input(getUserOnboarding).query(async (opts) => {
        const { input } = opts;

        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.id, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        const onboardingData = await db
            .select()
            .from(onboarding)
            .where(eq(onboarding.organizationId, member[0].organizationId))
            .limit(1);

        if (onboardingData.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Onboarding not found"
            });
        }

        const stepsData = await db
            .select()
            .from(step)
            .where(eq(step.onboardingId, onboardingData[0].id))
            .orderBy(step.order);

        return {
            data: onboardingData[0],
            steps: stepsData,
        }
    }),

    postResponse: publicProcedure.input(postResponse).mutation(async (opts) => {
        const { input } = opts;

        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        const existingResponses = await db
            .select()
            .from(onboardingResponse)
            .where(and(
                eq(onboardingResponse.onboardingId, input.onboardingId),
                eq(onboardingResponse.memberId, member[0].id)
            ))
            .limit(1);

        if (existingResponses.length > 0) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Responses for this onboarding already exist"
            });
        }

        const responses = await db.insert(onboardingResponse).values({
            value: input.responses,
            onboardingId: input.onboardingId,
            memberId: member[0].id,
            completed: input.completed
        }).returning()

        return responses[0];
    }),

    putResponse: publicProcedure.input(postResponse).mutation(async (opts) => {
        const { input } = opts;

        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        const existingResponses = await db
            .select()
            .from(onboardingResponse)
            .where(and(
                eq(onboardingResponse.onboardingId, input.onboardingId),
                eq(onboardingResponse.memberId, member[0].id)
            ))
            .limit(1);

        if (existingResponses.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Responses for this onboarding not found"
            });
        }

        const updatedResponses = await db.update(onboardingResponse).set({
            value: input.responses,
            completed: input.completed
        }).where(and(
            eq(onboardingResponse.onboardingId, input.onboardingId),
            eq(onboardingResponse.memberId, member[0].id)
        )).returning()

        return updatedResponses[0];
    }),

    getResponses: publicProcedure.input(getResponses).query(async (opts) => {
        const { input } = opts;

        const member = await db
            .select()
            .from(memberSchema)
            .where(eq(memberSchema.userId, input.userId))
            .limit(1);

        if (!member[0]) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User is not authenticated"
            });
        }

        const responses = await db
            .select()
            .from(onboardingResponse)
            .where(and(
                eq(onboardingResponse.onboardingId, input.onboardingId),
                eq(onboardingResponse.memberId, member[0].id)
            ))
            .limit(1);

        if (responses.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Responses for this onboarding not found"
            });
        }

        return responses[0];
    }),
});

type RouterOutput = inferRouterOutputs<typeof onboardingRouter>;
export type Onboarding = RouterOutput['get'];