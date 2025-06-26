"use client"

import { trpc } from "@/app/_trpc/client"
import { User } from "@/lib/session"
import { isEmpty } from "lodash"
import { Button } from "@/components/ui/button"
import { organization } from "@/lib/auth-client"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"

export default function UserInvitations({ user }: { user: User }) {
    const { data, isPending, refetch } = trpc.invitations.get.useQuery({ email: user.email })

    async function handleAccept(id: string) {
        await organization.acceptInvitation({
            invitationId: id
        }).then(() => refetch())
    }

    async function handleDecline(id: string) {
        await organization.rejectInvitation({
            invitationId: id
        }).then(() => refetch())
    }

    if (!data || isEmpty(data) || isPending) return null

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Pending invitations</h3>
                <p className="text-sm text-muted-foreground">
                    You have received invitations to join organizations
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item) => {
                    const { invitation, organization, user: inviter } = item

                    if (!organization || !inviter) return null

                    return (
                        <Card key={invitation.id} className="shadow-xs">
                            <CardHeader>
                                <CardTitle>{organization.name}</CardTitle>
                                <CardDescription>{inviter.name} invited you to join this organization</CardDescription>
                            </CardHeader>
                            <CardFooter className="gap-4">
                                <Button variant="secondary" onClick={() => handleDecline(invitation.id)}>Decline</Button>
                                <Button onClick={() => handleAccept(invitation.id)}>Accept</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
