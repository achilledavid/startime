"use client";
import { trpc } from "@/app/_trpc/client";
import OnboardingForm from "@/components/onboarding/form";
import { Loader2 } from "lucide-react";

export default function Content({ onboardingId }: { onboardingId: string }) {
    const { data: onboarding, isPending } = trpc.onboarding.get.useQuery({ onboardingId: onboardingId });

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 w-full h-full">
            <OnboardingForm onboarding={onboarding} />
        </div>
    );
}