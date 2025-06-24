import { Invitations } from "@/lib/organization";
import { Button } from "../ui/button";
import { isEmpty } from "lodash";
import { organization } from "@/lib/auth-client";

export default function OrganizationInvitations({ invitations, refetch }: { invitations: Invitations, refetch: () => void }) {
    if (isEmpty(invitations)) return

    async function handleCancel(id: string) {
        await organization.cancelInvitation({
            invitationId: id
        }).then(() => refetch())
    }

    return (
        <div>
            <p>Pending invitations</p>
            <ul>
                {invitations.map((invitation) => (
                    <li key={invitation.id} className="space-y-2">
                        <p>{invitation.email}</p>
                        <Button
                            onClick={() => handleCancel(invitation.id)}
                        >
                            Cancel
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}