import { db } from "@/db";
import { resources } from "@/db/schema";
import { deleteResources, getResources, postResources } from "@/schemas/resources";
import { publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { del } from "@vercel/blob";

export const resourcesRouter = router({
    get: publicProcedure.input(getResources).query(async (opts) => {
        const data = opts.input

        return await db
            .select()
            .from(resources)
            .where(eq(resources.organizationId, data.id))
    }),
    post: publicProcedure.input(postResources).mutation(async (opts) => {
        const data = opts.input

        return await db
            .insert(resources)
            .values({
                organizationId: data.id,
                ...data.payload,
            })
    }),
    delete: publicProcedure.input(deleteResources).mutation(async (opts) => {
        const data = opts.input;

        try {
            const res = await db
                .delete(resources)
                .where(eq(resources.url, data.url))

            const blob = await del(data.url);

            return { res, blob };
        } catch {
            return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete resource' })
        }
    }),
})

type RouterOutput = inferRouterOutputs<typeof resourcesRouter>;
export type Resource = RouterOutput['get'][number];
