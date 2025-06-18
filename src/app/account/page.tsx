import SignOut from "@/components/auth/sign-out";
import { authenticate } from "@/lib/session";

export default async function Account() {
  const session = await authenticate()

  return (
    <main className="p-4 space-y-4">
      <p>Hello {session.user.name}!</p>
      <SignOut />
    </main>
  )
}