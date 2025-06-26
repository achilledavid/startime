"use client"

import OnboardingForm from "@/components/onboarding/form";
import { Separator } from "@/components/ui/separator";
import { useOrganization } from "@/contexts/organization";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

export default function Page() {
    const { data } = useOrganization()
    const router = useRouter()

    if (!data) return

    return (
        <Fragment>
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create a new onboarding</h1>
                    <p className="text-muted-foreground">Design an onboarding experience that will help your new team members hit the ground running.</p>
                </div>
            </div>
            <Separator />
            <div className="p-4 w-full">
                <OnboardingForm onSuccess={() => {
                    router.push(`/${data.organization.slug}/admin/onboardings`)
                }} />
            </div>
        </Fragment>
    )
}
