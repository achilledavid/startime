import { db } from "@/db";
import { user } from "@/db/schema";
import { publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { getUser } from "@/schemas/user";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
    get: publicProcedure.input(getUser).query(async (opts) => {
        const data = opts.input

        const usr = await db
            .select()
            .from(user)
            .where(eq(user.id, data.id))


        if (!usr[0]) {
            throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        return usr[0]
    }),
})