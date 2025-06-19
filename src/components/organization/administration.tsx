"use client"

import { User } from "@/lib/session";
import SendInvitation from "./send-invitation";
import { Organization } from "@/lib/organization";
import { Fragment } from "react";
import OrganizationInvitations from "./invitations";
import { useQuery } from "@tanstack/react-query";
import { organization } from "@/lib/auth-client";

export default function OrganizationAdministration({ user, organization: data }: { user: User, organization: Organization }) {
    const queryInvitations = useQuery({
        queryKey: ["organization-invitations"],
        queryFn: async () => await organization.listInvitations()
    })

    const member = data.members.find((member) => member.userId === user.id)

    const invitations = queryInvitations.data?.data?.filter((invitation) => invitation.status === "pending")

    if (!member || member.role !== "owner" || !invitations) return

    return (
        <Fragment>
            <OrganizationInvitations invitations={invitations} refetch={queryInvitations.refetch} />
            <SendInvitation refetch={queryInvitations.refetch} />
        </Fragment>
    )
}