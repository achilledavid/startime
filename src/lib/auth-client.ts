import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

const client = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
})

export const { signIn, signOut, signUp, useSession } = client;
