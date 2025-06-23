import { auth } from "@/lib/auth";
import Content from "./content";
import { headers } from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return <div className="flex items-center justify-center h-full">You must be logged in to access this page.</div>;
    }

    return (
        <Content user={session.user} />
    )
}