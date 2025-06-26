import { invitationsRouter } from "@/routers/invitations";
import { router } from "./trpc";
import { organizationRouter } from "@/routers/organization";
import { onboardingRouter } from "@/routers/onboarding";
import { checklistRouter } from "@/routers/checklist";
import { resourcesRouter } from "@/routers/resources";
import { usersRouter } from "@/routers/users";

export const appRouter = router({
    invitations: invitationsRouter,
    organization: organizationRouter,
    onboarding: onboardingRouter,
    checklist: checklistRouter,
    resources: resourcesRouter,
    users: usersRouter
})

export type AppRouter = typeof appRouter