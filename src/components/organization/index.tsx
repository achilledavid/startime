"use client"

import { Fragment } from "react"
import { Loader2 } from "lucide-react"
import OrganizationMembers from "./members"
import OrganizationAdministration from "./administration"
import { User } from "@/lib/session"
import { notFound } from "next/navigation"
import { trpc } from "@/app/_trpc/client"

export default function Organization({ user, slug }: { user?: User, slug: string }) {
    const { data, isPending, isError } = trpc.organization.get.useQuery({ slug, userId: user?.id })

    if (isPending) return <Loader2 className="size-4 animate-spin" />

    if (!data || isError) notFound()

    return (
        <Fragment>
            <div>
                <p className="font-semibold">{data.organization.name}</p>
                <OrganizationMembers organization={data} />
            </div>
            <OrganizationAdministration organization={data} user={user} />
        </Fragment>
    )
}