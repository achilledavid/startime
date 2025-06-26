"use client"

import { useActiveMember } from "@/lib/auth-client";
import { trpc } from "@/app/_trpc/client";
import { Fragment, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Loader2, ListCheck, CheckCircle } from "lucide-react";
import { parseAsInteger, useQueryState } from 'nuqs'
import Stepper from "../../../components/steps/stepper";
import { PossibleValue } from "@/components/steps/step";

export type Responses = Record<number, PossibleValue>;

export default function Onboarding() {
    const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0))
    const [completed, setCompleted] = useState(false);
    const [responses, setResponses] = useState<Responses | null>(null);

    const { data: member } = useActiveMember()
    const { data: onboarding, isPending } = trpc.onboarding.getUserOnboarding.useQuery({ userId: member?.id || "", }, { enabled: !!member, retry: false });

    const { data: initialResponses, refetch: refetchResponses, isPending: isPendingResponses } = trpc.onboarding.getResponses.useQuery({
        userId: member?.userId || "",
        onboardingId: onboarding?.data.id || 0,
    }, {
        enabled: !!member && !!onboarding, retry: false
    });




    useEffect(() => {
        if (!initialResponses) return;
        setCompleted(initialResponses.completed);
        setResponses(initialResponses?.value as PossibleValue || {});
    }, [initialResponses])

    // TODO: get duration from db
    const duration = onboarding?.steps?.reduce((total, step) => total + (step.duration), 0) || 0;

    function onComplete() {
        setStep(0)
        setCompleted(true)
        refetchResponses()
    }

    if (!member) return

    return (
        <Fragment>
            <div className="p-6">
                {(step > 0 && onboarding) ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">{onboarding.data.title}</h1>
                            <p className="text-muted-foreground">{onboarding.data.description}</p>
                        </div>
                        {completed && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-md w-fit">
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="size-4" />
                                    <span className="text-sm font-medium">Onboarding completed</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Welcome to your onboarding!</h1>
                            <p className="text-muted-foreground">Let&apos;s get you set up and ready to go with your new workspace.</p>
                        </div>
                        {completed && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-md w-fit">
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="size-4" />
                                    <span className="text-sm font-medium">Onboarding completed</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Separator />
            {isPending ? (
                <div className="w-full min-h-40 flex items-center justify-center">
                    <Loader2 className="size-4 animate-spin" />
                </div>
            ) : (
                onboarding ? (
                    step !== 0 ? (
                        <div className="p-4">
                            <Stepper current={step} setCurrent={setStep} onboarding={onboarding} member={member} onComplete={onComplete} setResponses={setResponses} responses={responses} isPendingResponses={isPendingResponses} />
                        </div>
                    ) : (
                        <div className="p-4 max-w-2xl">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{onboarding.data.title}</CardTitle>
                                    <CardDescription>{onboarding.data.description}</CardDescription>
                                </CardHeader >
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                        <div className="flex items-center gap-1">
                                            <ListCheck className="size-4" />
                                            <span>{onboarding.steps.length} steps</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-4" />
                                            <span>{duration}min</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="font-medium text-sm">What you&apos;ll learn:</p>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            {onboarding.steps?.map((step, index) => (
                                                <li key={step.id || index} className="ml-2">
                                                    {step.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => setStep(1)}
                                    >
                                        {completed ? "See my onboarding" : "Get started"}
                                        <ArrowRight />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )
                ) : (
                    <div className="p-4">
                        <p>No onboarding assigned to you yet</p>
                    </div>
                )
            )}
        </Fragment >
    )
}
