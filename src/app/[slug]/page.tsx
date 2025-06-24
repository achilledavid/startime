"use client"

import { useOrganization } from "@/contexts/organization"

export default function Organization() {
    const { data, isPending } = useOrganization()

    if (!data || isPending) return

    return (
        <p>{data.organization.name}</p>
    )
}