"use client"

import { trpc } from "@/app/_trpc/client"
import UploadResource from "@/components/upload-resource"
import { useOrganization } from "@/contexts/organization"
import { isEmpty } from "lodash"
import { Loader2 } from "lucide-react"
import ResourceCard from "./resource-card"
import { useActiveMember } from "@/lib/auth-client"

export default function Resources() {
    const { data } = useOrganization()
    const { data: member } = useActiveMember()
    const { data: resources, refetch, isPending } = trpc.resources.get.useQuery(
        { id: data?.organization.id ?? '' },
        { enabled: !!data?.organization.id }
    );

    if (!data || !member) return

    if (isPending) return <Loader2 className="size-4 animate-spin" />

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {(resources && !isEmpty(resources)) ?
                    resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    )) : (
                        <p>No resources yet</p>
                    )
                }
            </div>
            {member.role === "owner" && <UploadResource organization={data.organization} onSuccess={refetch} />}
        </div>
    )
}