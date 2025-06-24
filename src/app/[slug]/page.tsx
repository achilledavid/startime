"use client"

import { useOrganization } from "@/contexts/organization"

export default function Organization() {
    const { data, isPending } = useOrganization()

    if (!data || isPending) return

    return (
        <div className="p-4">
            <p>{data.organization.name}</p>
        </div>
    )
}