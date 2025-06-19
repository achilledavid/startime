import { db } from "@/db";
import { invitation, organization, user } from "@/db/schema";
import { userEmail } from "@/schemas/user";
import { publicProcedure, router } from "@/server/trpc";
import { and, eq, gt } from "drizzle-orm";

export const invitationsRouter = router({
    get: publicProcedure.input(userEmail).query(async (opts) => {
        const data = opts.input
        return await db
            .select()
            .from(invitation)
            .where(
                and(
                    eq(invitation.email, data.email),
                    eq(invitation.status, "pending"),
                    gt(invitation.expiresAt, new Date())
                )
            )
            .leftJoin(user, eq(invitation.inviterId, user.id))
            .leftJoin(organization, eq(invitation.organizationId, organization.id))
    })
})