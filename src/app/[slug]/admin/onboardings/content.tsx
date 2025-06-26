"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useActiveMember } from "@/lib/auth-client";
import { Organization } from "better-auth/plugins/organization";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Content({ organization }: { organization: Organization }) {
    const { data: activeMember, isPending: isMemberPending } = useActiveMember();
    const { data: onboardings, isPending, refetch } = trpc.onboarding.getAll.useQuery({
        organizationId: organization.id,
        limit: 10,
        offset: 0,
    }, { retry: false });
    const { mutate: deleteOnboarding } = trpc.onboarding.delete.useMutation();

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    function handleDelete(onboardingId: number) {
        if (!activeMember || isMemberPending || activeMember.role !== "owner") {
            console.error("User is not authorized to delete this onboarding");
            return;
        }

        deleteOnboarding({ onboardingId, userId: activeMember.userId });
        refetch();
    }

    return (
        <div className="p-8 w-full h-full">
            <h1 className="text-2xl font-bold mb-4">Onboardings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onboardings?.map((onboarding) => (
                    <Link key={onboarding.id} className="p-4 border rounded-lg shadow-sm" href={`/${organization.slug}/admin/onboardings/${onboarding.id}`}>
                        <h2 className="text-xl font-semibold">{onboarding.title}</h2>
                        <p className="text-gray-600">{onboarding.description}</p>
                        <Button className="mt-2" variant="destructive" onClick={() => handleDelete(onboarding.id)}>
                            Delete
                        </Button>
                    </Link>
                ))}

                {onboardings?.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center">
                        <p className="text-gray-500">No onboardings found. Create your first onboarding!</p>
                    </div>
                )}
            </div>
        </div>
    );

}

