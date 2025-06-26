import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Content from "./content";
import { Member } from "better-auth/plugins/organization";

export default async function Page() {
    const member = await auth.api.getActiveMember({
        headers: await headers(),
    });

    return <Content member={member as Member} />;
}