"use client"

import { Separator } from "@/components/ui/separator"
import { useOrganization } from "@/contexts/organization"
import { Fragment } from "react"

export default function Organization() {
    const { data, isPending } = useOrganization()

    if (!data || isPending) return

    return (
        <Fragment>
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome to {data.organization.name}!</h1>
                    <p className="text-muted-foreground">We are delighted to have you with us. Meet the team members and start collaborating today.</p>
                </div>
            </div>
            <Separator />
        </Fragment>
    )
}