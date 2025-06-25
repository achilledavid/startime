"use client"

import { useOrganization } from "@/contexts/organization";
import { organization, useSession } from "@/lib/auth-client";
import MemberCard from "./member-card";
import { Separator } from "@/components/ui/separator";
import SendInvitation from "@/components/organization/send-invitation";
import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InvitationCard from "./invitation-card";

export default function Members() {
    const { data, refetch } = useOrganization();
    const session = useSession()
    const { data: invitations, refetch: refetchInvitations, isPending } = useQuery({
        queryKey: ["organization-invitations"],
        queryFn: async () => await organization.listInvitations()
    })

    if (!data || !session.data?.user) return

    const member = data.members.find((item) => item.member.userId === session.data?.user?.id)?.member

    if (!member) return

    const isOwner = member.role === "owner"

    return (
        <Fragment>
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Team Members</h1>
                    <p className="text-muted-foreground">Meet the members who make this team thrive every day.</p>
                </div>
            </div>
            <Separator />
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.members.map((item) => {
                    if (!item.user) return null;
                    return <MemberCard key={item.member.id} isOwner={isOwner} member={{ ...item.member, createdAt: new Date(item.member.createdAt) }} user={item.user} refetch={refetch} />;
                })}
            </div>
            {isOwner && (
                <Fragment>
                    <Separator />
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Sent Invitations</h1>
                                <p className="text-muted-foreground">Here are all the invitations that have been sent.</p>
                            </div>
                            {isOwner && <SendInvitation refetch={refetchInvitations} />}
                        </div>
                    </div>
                    <Separator />
                    {(isPending || !invitations?.data) ? (
                        <div className="w-full min-h-40 flex items-center justify-center">
                            <Loader2 className="size-4 animate-spin" />
                        </div>
                    ) : (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {invitations.data.map((invitation) => (
                                <InvitationCard key={invitation.id} invitation={invitation} isOwner={isOwner} refetch={refetchInvitations} />
                            ))}
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}