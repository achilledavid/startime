import { invitationsRouter } from "@/routers/invitations";
import { router } from "./trpc";
import { organizationRouter } from "@/routers/organization";
import { onboardingRouter } from "@/routers/onboarding";
import { checklistRouter } from "@/routers/checklist";

export const appRouter = router({
    invitations: invitationsRouter,
    organization: organizationRouter,
    onboarding: onboardingRouter,
    checklist: checklistRouter
})

export type AppRouter = typeof appRouter