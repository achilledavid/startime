"use client"

import { useActiveOrganization } from "@/lib/auth-client"
import { Fragment } from "react"
import CreateOrganization from "./create"
import { Loader2 } from "lucide-react"
import OrganizationMembers from "./members"
import UserInvitations from "./user-invitations"
import OrganizationAdministration from "./administration"
import { User } from "@/lib/session"

export default function Organization({ user }: { user: User }) {
    const { data, isPending } = useActiveOrganization()

    if (isPending) return <Loader2 className="size-4 animate-spin" />

    return (
        <Fragment>
            {data ? (
                <Fragment>
                    <div>
                        <p className="font-semibold">{data.name}</p>
                        <OrganizationMembers organization={data} />
                    </div>
                    <OrganizationAdministration organization={data} user={user} />
                </Fragment>
            ) : (
                <Fragment>
                    <CreateOrganization />
                    <UserInvitations user={user} />
                </Fragment>
            )}
        </Fragment>
    )
}