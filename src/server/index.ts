import { invitationsRouter } from "@/routers/invitations";
import { router } from "./trpc";
import { organizationRouter } from "@/routers/organization";
import { resourcesRouter } from "@/routers/resources";

export const appRouter = router({
    invitations: invitationsRouter,
    organization: organizationRouter,
    resources: resourcesRouter
})

export type AppRouter = typeof appRouter