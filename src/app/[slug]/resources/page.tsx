"use client"

import { trpc } from "@/app/_trpc/client"
import UploadResource from "@/components/upload-resource"
import { useOrganization } from "@/contexts/organization"
import { isEmpty } from "lodash"
import { Loader2 } from "lucide-react"
import ResourceCard from "./resource-card"
import { useActiveMember } from "@/lib/auth-client"
import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"

export default function Resources() {
    const { data } = useOrganization()
    const { data: member } = useActiveMember()
    const { data: resources, refetch, isPending } = trpc.resources.get.useQuery(
        { id: data?.organization.id ?? '' },
        { enabled: !!data?.organization.id }
    );

    if (!data || !member) return

    const isOwner = member.role === "owner"
    return (
        <Fragment>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Resources & Documents</h1>
                        <p className="text-muted-foreground">All your team&apos;s important files and documents, organized in one place.</p>
                    </div>
                    {isOwner && <UploadResource organization={data.organization} onSuccess={refetch} />}
                </div>
            </div>
            <Separator />
            <div className="p-4">
                {isPending ? (
                    <div className="w-full min-h-40 flex items-center justify-center">
                        <Loader2 className="size-4 animate-spin" />
                    </div>
                ) : (
                    (resources && !isEmpty(resources)) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                        </div>
                    ) : (
                        <p>No resources yet</p>
                    )
                )}
            </div>
        </Fragment>
    )
}
