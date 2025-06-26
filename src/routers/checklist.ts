import { publicProcedure, router } from "@/server/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { getChecklist, postChecklist, putChecklist } from '@/schemas/checklist';
import { db } from "@/db";
import { checklist } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checklistRouter = router({
    get: publicProcedure.input(getChecklist).query(async (opts) => {
        const { input } = opts;

        const checklistData = await db
            .select()
            .from(checklist)
            .where(eq(checklist.id, input.id))
            .limit(1);

        if (checklistData.length === 0) {
            throw new Error("Checklist not found");
        }

        return {
            data: checklistData[0],
        };
    }),
    post: publicProcedure.input(postChecklist).mutation(async (opts) => {
        const { input } = opts;

        const newchecklist = await db
            .insert(checklist)
            .values({
                answers: input.items,
            })
            .returning();

        return {
            data: newchecklist[0],
        };
    }),
    put: publicProcedure.input(putChecklist).mutation(async (opts) => {
        const { input } = opts;

        const updatedChecklist = await db
            .update(checklist)
            .set({
                answers: input.items,
            })
            .where(eq(checklist.id, Number(input.id)))
            .returning();

        return {
            data: updatedChecklist[0],
        };
    }),
});

type RouterOutput = inferRouterOutputs<typeof checklistRouter>;
export type Checklist = RouterOutput['post'];