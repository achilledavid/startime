"use client"

import { useSession } from "@/lib/auth-client"
import Organization from "@/components/organization"

export default function OrganizationContent({ slug }: { slug: string }) {
    const session = useSession()

    return (
        <Organization slug={slug} user={session.data?.user} />
    )
}