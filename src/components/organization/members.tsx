import { Organization } from "@/lib/organization";

export default function OrganizationMembers({ organization }: { organization: Organization }) {
    return (
        <ul>
            {organization.members.map((member) => (
                <li key={member.id}>{member.user.name} - {member.role}</li>
            ))}
        </ul>
    )
}