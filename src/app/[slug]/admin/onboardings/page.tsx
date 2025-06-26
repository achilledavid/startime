import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Content from "./content";

export default async function Page() {
    const organization = await auth.api.getFullOrganization({
        headers: await headers()
    })

    if (!organization) {
        return <div className="p-8 w-full h-full">No organization found.</div>;
    }

    return (
        <div className="p-8 w-full h-full">
            <Content organization={organization} />
        </div>
    );
}