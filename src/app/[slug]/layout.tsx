import { AppSidebar } from "@/components/app-sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OrganizationProvider } from "@/contexts/organization";
import { authenticate } from "@/lib/session";
import { PropsWithChildren } from "react";

export default async function OrganizationLayout({ params, children }: PropsWithChildren<{ params: Promise<{ slug: string }> }>) {
    const { slug } = await params
    const { user } = await authenticate()

    return (
        <OrganizationProvider slug={slug} userId={user.id}>
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </OrganizationProvider>
    )
}