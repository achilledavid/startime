import { db } from "@/db";
import { resources } from "@/db/schema";
import { getResources, postResources } from "@/schemas/resources";
import { publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { inferRouterOutputs } from "@trpc/server";

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
})

type RouterOutput = inferRouterOutputs<typeof resourcesRouter>;
export type Resource = RouterOutput['get'][number];