import { db } from "@/db";
import { member, organization, user } from "@/db/schema";
import { getOrganization } from "@/schemas/organization";
import { publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { inferRouterOutputs, TRPCError } from "@trpc/server";

export const organizationRouter = router({
    get: publicProcedure.input(getOrganization).query(async (opts) => {
        const data = opts.input;

        const org = await db
            .select()
            .from(organization)
            .where(eq(organization.slug, data.slug))
            .limit(1);

        if (!org[0]) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
        }

        const members = await db
            .select()
            .from(member)
            .where(eq(member.organizationId, org[0].id))
            .leftJoin(user, eq(user.id, member.userId));

        const isMember = members.some(m => m.member.userId === data.userId);

        if (!isMember) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not a member of this organization" });
        }

        return {
            organization: org[0],
            members,
        };
    })
});

type RouterOutput = inferRouterOutputs<typeof organizationRouter>;
export type Organization = RouterOutput['get'];