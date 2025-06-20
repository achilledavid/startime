import SignOut from "@/components/auth/sign-out";
import { authenticate } from "@/lib/session";
import MyOrganization from "./my-organization";

export default async function Account() {
  const session = await authenticate()

  return (
    <main className="p-4 flex flex-col gap-4">
      <p>Hello {session.user.name}!</p>
      <MyOrganization user={session.user} />
      <SignOut />
    </main>
  )
}