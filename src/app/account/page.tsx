import SignOut from "@/components/auth/sign-out";
import Header from "@/components/header";
import { authenticate } from "@/lib/session";
import MyOrganization from "./my-ogranization";

export default async function Account() {
  const session = await authenticate()

  return (
    <>
    <Header />
    <main className="p-4 flex flex-col gap-4">
      <p>Hello {session.user.name}!</p>
      <MyOrganization user={session.user} />
      <SignOut />
    </main>
    </>
  )
}