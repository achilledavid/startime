"use client";
import { trpc } from "@/app/_trpc/client";
import OnboardingForm from "@/components/onboarding/form";
import { useOrganization } from "@/contexts/organization";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Content({ onboardingId }: { onboardingId: number }) {
    const { data: onboarding, isPending } = trpc.onboarding.get.useQuery({ onboardingId: onboardingId });
    const { data } = useOrganization()
    const router = useRouter();

    if (!data) return

    if (isPending) {
        return (
            <div className="p-4 flex items-center justify-center min-h-40">
                <Loader2 className="animate-spin size-4" />
            </div>
        );
    }

    return (
        <div className="p-4">
            <OnboardingForm onboarding={onboarding} onSuccess={() => {
                router.push(`/${data.organization.slug}/admin/onboardings`)
            }} />
        </div>
    );
}
