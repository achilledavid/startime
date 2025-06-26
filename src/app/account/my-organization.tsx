"use client"

import CreateOrganization from "@/components/organization/create"
import UserInvitations from "@/components/organization/user-invitations"
import { Button } from "@/components/ui/button"
import { useActiveOrganization } from "@/lib/auth-client"
import { User } from "@/lib/session"
import { Building2, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MyOrganization({ user }: { user: User }) {
    const { data, isPending } = useActiveOrganization()

    if (isPending) return (
        <div className="flex items-center justify-center min-h-40">
            <Loader2 className="animate-spin size-4" />
        </div>
    )

    if (!data) return (
        <Fragment>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Organization</h3>
                    <p className="text-sm text-muted-foreground">
                        You don&apos;t belong to any organization at the moment
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <CreateOrganization />
                    <div className="text-sm text-muted-foreground">
                        or join an existing organization
                    </div>
                </div>
            </div>
            <UserInvitations user={user} />
        </Fragment>
    )

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Your organization</h3>
                <p className="text-sm text-muted-foreground">
                    You are a member of this organization
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow-xs">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {data.name}
                        </CardTitle>
                        <CardDescription>
                            Click to access your organization dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href={`/${data.slug}`} className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Go to organization
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
