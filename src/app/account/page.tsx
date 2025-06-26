import SignOut from "@/components/auth/sign-out";
import Header from "@/components/header";
import { authenticate } from "@/lib/session";
import MyOrganization from "./my-organization";
// import EditProfile from "@/components/auth/edit-profile";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail } from "lucide-react";
import { Fragment } from "react";

export default async function Account() {
  const session = await authenticate()

  return (
    <Fragment>
      <Header />
      <main className="p-4 max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4 w-full">
            <h1 className="text-2xl font-bold tracking-tight mr-auto">{session.user.name}</h1>
            {/* <EditProfile user={session.user} /> */}
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              {session.user.email}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              Member since {new Date(session.user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-6">
          <MyOrganization user={session.user} />
        </div>
        <SignOut />
      </main>
    </Fragment>
  )
}
