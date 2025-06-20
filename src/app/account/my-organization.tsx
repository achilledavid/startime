"use client"

import CreateOrganization from "@/components/organization/create"
import { Button } from "@/components/ui/button"
import { useActiveOrganization } from "@/lib/auth-client"
import { Building2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function MyOrganization() {
    const { data, isPending } = useActiveOrganization()

    if (isPending) return <Loader2 className="animate-spin size-4" />

    if (!data) return (
        <CreateOrganization />
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