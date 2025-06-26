"use client"

import { trpc } from "@/app/_trpc/client";
import { Separator } from "@/components/ui/separator";
import { useOrganization } from "@/contexts/organization";
import { Loader2 } from "lucide-react";
import { Fragment } from "react";
import OnBoardingCard from "./onboarding-card";
import { useActiveMember } from "@/lib/auth-client";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    const { data: member } = useActiveMember()
    const { data } = useOrganization()

    const { data: onboardings, isPending, refetch } = trpc.onboarding.getAll.useQuery({
        organizationId: data?.organization.id || "",
    }, { retry: false });

    if (!data || !member) return

    return (
        <Fragment>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Onboardings</h1>
                        <p className="text-muted-foreground">Manage and create onboarding experiences to welcome new members to your organization.</p>
                    </div>
                    <Button asChild>
                        <Link href={`/${data.organization.slug}/admin/onboardings/new`}>Create a new onboarding</Link>
                    </Button>
                </div>
            </div>
            <Separator />
            {!onboardings || isPending ? (
                <div className="min-h-40 flex items-center justify-center">
                    <Loader2 className="animate-spin size-4" />
                </div>
            ) : (
                isEmpty(onboardings) ? (
                    <div className="p-4">
                        <p>No onboardings created yet.</p>
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {onboardings.map((item) => (
                            <OnBoardingCard key={item.id} slug={data.organization.slug} onboarding={item} refetch={refetch} member={member} />
                        ))}
                    </div>
                )
            )
            }
        </Fragment >
    );
}
