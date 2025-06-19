import SignOut from "@/components/auth/sign-out";
import Organization from "@/components/organization";
import { authenticate } from "@/lib/session";

export default async function Account() {
  const session = await authenticate()

  return (
    <main className="p-4 flex flex-col gap-4">
      <p>Hello {session.user.name}!</p>
      <Organization user={session.user} />
      <SignOut />
    </main>
  )
}