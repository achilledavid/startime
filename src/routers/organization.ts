import { db } from "@/db";
import { organization } from "@/db/schema";
import { organizationId } from "@/schemas/organization";
import { publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";

export const organizationRouter = router({
    get: publicProcedure.input(organizationId).query(async (opts) => {
        const data = opts.input
        return await db
            .select()
            .from(organization)
            .where(eq(organization.id, data.id),);
    })
})