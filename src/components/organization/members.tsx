import { Organization } from "@/routers/organization";

export default function OrganizationMembers({ organization }: { organization: Organization }) {
    return (
        <ul>
            {organization.members.map((item) => (
                <li key={item.member.id}>{item.user?.name} - {item.member.role}</li>
            ))}
        </ul>
    )
}