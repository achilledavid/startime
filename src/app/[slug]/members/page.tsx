"use client"

import OrganizationAdministration from "@/components/organization/administration";
import { useOrganization } from "@/contexts/organization";
import { useSession } from "@/lib/auth-client";

export default function Members() {
    const { data } = useOrganization();
    const session = useSession()

    if (!data || !session.data?.user) return

    return (
        <div className="space-y-4">
            <ul>
                {data.members.map((item) => (
                    <li key={item.member.id}>{item.user?.name} - {item.member.role}</li>
                ))}
            </ul>
            <OrganizationAdministration user={session.data?.user} organization={data} />
        </div>
    )
}