"use client"

import { useOrganization } from "@/contexts/organization";

export default function Members() {
    const { data } = useOrganization();

    if (!data) return

    return (
        <ul>
            {data.members.map((item) => (
                <li key={item.member.id}>{item.user?.name} - {item.member.role}</li>
            ))}
        </ul>
    )
}