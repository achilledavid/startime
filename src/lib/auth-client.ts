import { createAuthClient } from "better-auth/react"
import { customSessionClient, organizationClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

const client = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),
    organizationClient()
  ],
})

export type { User, Session } from "better-auth/types";

export const { signIn, signOut, signUp, useSession, organization, useActiveOrganization, useListOrganizations, useActiveMember } = client;
