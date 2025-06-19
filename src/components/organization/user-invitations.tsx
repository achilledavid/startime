"use client"

import { trpc } from "@/app/_trpc/client"
import { User } from "@/lib/session"
import { isEmpty } from "lodash"
import { Button } from "@/components/ui/button"
import { organization } from "@/lib/auth-client"

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

    if (!data || isEmpty(data) || isPending) return

    return (
        <div>
            <p>Pending invitations</p>
            <ul>
                {data.map((item) => {
                    const { invitation, organization, user: inviter } = item

                    if (!organization || !inviter) return

                    return (
                        <li key={invitation.id} className="space-y-2">
                            <p>{inviter.name} invited you to join <strong className="font-semibold">{organization.name}</strong></p>
                            <div className="space-x-2">
                                <Button
                                    onClick={() => handleAccept(invitation.id)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleDecline(invitation.id)}
                                >
                                    Decline
                                </Button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}