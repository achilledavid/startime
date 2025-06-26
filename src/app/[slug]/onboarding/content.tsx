"use client";
import { trpc } from "@/app/_trpc/client";
import OnboardingComponent from "@/components/onboarding/render";
import { Member } from "better-auth/plugins/organization";
import { Loader2 } from "lucide-react";

export default function Content({ member }: { member: Member }) {
    const { data: onboarding, isPending } = trpc.onboarding.getUserOnboarding.useQuery({
        userId: member.id,
    });

    if (isPending) {
        return <Loader2 className="animate-spin h-6 w-6 text-gray-500" />;
    }

    if (!onboarding) {
        return <div>No onboarding data available.</div>;
    }

    return <OnboardingComponent onboarding={onboarding} />;
}