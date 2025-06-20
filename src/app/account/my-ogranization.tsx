"use client"

import Organization from "@/components/organization"
import { useActiveOrganization } from "@/lib/auth-client"
import { User } from "@/lib/session"

export default function MyOrganization({ user }: { user: User }) {
    const { data } = useActiveOrganization()

    if (!data) return

    return (
        <Organization user={user} slug={data.slug} />
    )
}