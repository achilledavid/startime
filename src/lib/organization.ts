import { organization } from "@/lib/auth-client";
import { invitation } from "@/db/schema";

export type Invitation = Array<typeof invitation.$inferSelect>[number];
export type Invitations = Array<Invitation>;

export async function createOrganization({ name }: { name: string }) {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    try {
        const response = await organization.create({ name, slug });

        if (response.error) throw new Error(response.error.message);

        return response;
    } catch (error) {
        throw error;
    }
}

export async function sendInvitation({ email }: { email: string }) {
    return await organization.inviteMember({
        email,
        role: "member"
    })
}