"use client"

import CreateOrganization from "@/components/organization/create"
import UserInvitations from "@/components/organization/user-invitations"
import { Button } from "@/components/ui/button"
import { useActiveOrganization } from "@/lib/auth-client"
import { User } from "@/lib/session"
import { Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

export default function MyOrganization({ user }: { user: User }) {
    const { data, isPending } = useActiveOrganization()

    if (isPending) return <Loader2 className="animate-spin size-4" />

    if (!data) return (
        <Fragment>
            <CreateOrganization />
            <UserInvitations user={user} />
        </Fragment>
    )

    return (
        <Button variant="secondary" className="w-fit" asChild>
            <Link href={`/${data.slug}`}>
                <Building2 />
                {data.name}
            </Link>
        </Button>
    )
}