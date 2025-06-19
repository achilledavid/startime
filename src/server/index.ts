import { invitationsRouter } from "@/routers/invitations";
import { router } from "./trpc";
import { organizationRouter } from "@/routers/organization";

export const appRouter = router({
    invitations: invitationsRouter,
    organization: organizationRouter
})

export type AppRouter = typeof appRouter