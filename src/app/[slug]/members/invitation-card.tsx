import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { organization } from "@/lib/auth-client";
import { Invitation } from "@/lib/organization";
import { Ban, CircleCheck, CircleDashed, CircleX, Clock, MoreVertical } from "lucide-react";

export default function InvitationCard({ invitation, isOwner = false, refetch }: { invitation: Invitation, isOwner?: boolean, refetch: () => void }) {
    async function handleCancel() {
        await organization.cancelInvitation({
            invitationId: invitation.id
        }).then(() => refetch())
    }

    const { data: inviter } = trpc.users.get.useQuery({ id: invitation.inviterId })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "rejected":
                return CircleX
            case "accepted":
                return CircleCheck
            case "canceled":
                return Ban
            default:
                return CircleDashed
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "rejected":
                return "destructive"
            case "accepted":
                return "success"
            case "canceled":
                return "destructive"
            default:
                return "waiting"
        }
    }

    const StatusIcon = getStatusIcon(invitation.status)

    if (!inviter) return

    return (
        <Card>
            <CardHeader>
                <CardTitle>{invitation.email}</CardTitle>
                <CardDescription>Invited by {inviter.name.split(" ")[0]} as {invitation.role}</CardDescription>
                {(invitation.status === "pending" && isOwner) && (
                    <CardAction>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleCancel} variant="destructive"><CircleX />Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(invitation.status)} className="capitalize">
                    <StatusIcon className="w-3 h-3" />
                    {invitation.status}
                </Badge>
                {invitation.status === "pending" && (
                    <Badge variant="secondary">
                        <Clock className="w-3 h-3" />
                        {new Date(invitation.expiresAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                    </Badge>
                )}
            </CardContent>
        </Card >
    )
}