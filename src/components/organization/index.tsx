"use client"

import { Fragment } from "react"
import CreateOrganization from "./create"
import { Loader2 } from "lucide-react"
import OrganizationMembers from "./members"
import UserInvitations from "./user-invitations"
import OrganizationAdministration from "./administration"
import { User } from "@/lib/session"
import Link from "next/link"
import { notFound } from "next/navigation"
import { trpc } from "@/app/_trpc/client"

export default function Organization({ user, slug }: { user?: User, slug: string }) {
    const { data, isPending, isError } = trpc.organization.get.useQuery({ slug, userId: user?.id })

    if (isPending) return <Loader2 className="size-4 animate-spin" />

    if (!data || isError) notFound()

    return (
        <Fragment>
            {data ? (
                <Fragment>
                    <div>
                        <Link href={`/${data.organization.slug}`} className="font-semibold hover:underline">{data.organization.name}</Link>
                        <OrganizationMembers organization={data} />
                    </div>
                    <OrganizationAdministration organization={data} user={user} />
                </Fragment>
            ) : (
                <Fragment>
                    <CreateOrganization />
                    {user && <UserInvitations user={user} />}
                </Fragment>
            )}
        </Fragment>
    )
}