import { invitationsRouter } from "@/routers/invitations";
import { router } from "./trpc";
import { organizationRouter } from "@/routers/organization";
import { onboardingRouter } from "@/routers/onboarding";

export const appRouter = router({
    invitations: invitationsRouter,
    organization: organizationRouter,
    onboarding: onboardingRouter
})

export type AppRouter = typeof appRouter