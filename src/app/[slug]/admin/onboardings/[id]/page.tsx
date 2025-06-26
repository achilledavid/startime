import { Fragment } from "react";
import Content from "./content";
import { Separator } from "@/components/ui/separator";

export default async function Page({ params }: { params: Promise<{ slug: string; id: string }> }) {
    const { id } = await params;

    return (
        <Fragment>
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit onboarding</h1>
                    <p className="text-muted-foreground">Fine-tune your onboarding experience and make it perfect for your new team members.</p>
                </div>
            </div>
            <Separator />
            <Content onboardingId={parseInt(id)} />
        </Fragment>
    );

}
