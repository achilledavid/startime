"use client"

import { useOrganization } from "@/contexts/organization"

export default function Resources() {
    const { data } = useOrganization()

    if (!data) return

    return (
        <div className="p-4 space-y-4">
            <p>{data.organization.name} resources</p>
        </div>
    )
}