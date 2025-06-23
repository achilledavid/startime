"use client";

import { trpc } from "@/app/_trpc/client";
import OnboardingForm from "@/components/onboarding/form";
import { User } from "@/lib/session";

export default function Content({ user }: { user: User }) {
    const { data, isPending, isError, error } = trpc.onboarding.get.useQuery({ userId: user.id }, {
        retry: false,
    });

    if (isPending) return <div className="flex items-center justify-center h-full"><span className="loader"></span></div>;
    if (isError && error.data?.code !== "NOT_FOUND") return <div className="text-red-500">{error.message}</div>;

    return (
        <>
            {data ? (
                <OnboardingForm onboarding={data} />
            ) : (
                <OnboardingForm />
            )}
        </>
    );
}