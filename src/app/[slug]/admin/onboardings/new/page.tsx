"use client"

import OnboardingForm from "@/components/onboarding/form";
import { useOrganization } from "@/contexts/organization";
import { useRouter } from "next/navigation";

export default function Page() {
    const { data } = useOrganization()
    const router = useRouter()

    if (!data) return

    return (
        <div className="p-8 w-full h-full">
            <OnboardingForm onSuccess={() => {
                router.push(`/${data.organization.slug}/admin/onboardings`)
            }} />
        </div>
    )
}
