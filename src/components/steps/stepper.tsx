"use client"

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/routers/onboarding";
import { Member } from "better-auth/plugins/organization";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import Step from "./step";

export default function Stepper({ current, onboarding, setCurrent, member, onComplete }: {
  current: number,
  onboarding: Onboarding,
  setCurrent: (value: number | ((prev: number) => number)) => void,
  member: Member,
  onComplete: () => void
}) {
  const { steps } = onboarding;
  const step = steps[current - 1];

  const completeMutation = trpc.onboarding.postResponse.useMutation({
    onSettled: () => {
      onComplete()
    }
  })

  if (!step) notFound()

  function handleComplete() {
    completeMutation.mutate({
      userId: member.userId,
      onboardingId: onboarding.data.id,
      completed: true,
      responses: {}
    })
  }

  return (
    <Fragment>
      <div>
        <Step step={step} />
      </div>
      <div className="flex items-center justify-between mt-4">
        {current <= 1 ? (
          <Button className="transition-none" variant="secondary" onClick={() => setCurrent(0)}>Cancel</Button>
        ) : (
          <Button className="transition-none" variant="secondary" onClick={() => setCurrent((old) => old - 1)}>
            <ArrowLeft />
            Previous
          </Button>
        )}
        {current >= steps.length ? (
          <Button className="transition-none" onClick={handleComplete} disabled={completeMutation.isPending}>Complete</Button>
        ) : (
          <Button className="transition-none" onClick={() => setCurrent((old) => old + 1)}>
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </Fragment>
  )
}
