"use client"

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/routers/onboarding";
import { Member } from "better-auth/plugins/organization";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import Step, { PossibleValue } from "./step";
import { Responses } from "@/app/[slug]/onboarding/page";

export default function Stepper({ current, onboarding, setCurrent, member, onComplete, responses, setResponses, isPendingResponses }: {
  current: number,
  onboarding: Onboarding,
  setCurrent: (value: number | ((prev: number) => number)) => void,
  member: Member,
  onComplete: () => void,
  responses: Responses | null,
  setResponses: (responses: Responses) => void,
  isPendingResponses: boolean
}) {
  const { steps } = onboarding;
  const step = steps[current - 1];
  const didMount = useRef(false);

  const updateOrCreateMutation = trpc.onboarding.updateOrCreateResponse.useMutation();

  if (!step) notFound()

  function getUpdatedResponses(stepId: number, value: PossibleValue): Responses {
    return { ...responses, [stepId]: value };
  }

  function getLastUncompletedStep(initialResponses: Responses): number {
    const completedSteps = Object.keys(initialResponses).filter((stepId) => {
      return initialResponses[parseInt(stepId)].completed
    });
    const lastUncompletedStepId = completedSteps.length > 0 ? Math.max(...completedSteps.map(Number)) : -1;

    const indexInSteps = steps.findIndex((step) => step.id === lastUncompletedStepId);

    return indexInSteps >= 0 ? indexInSteps + 1 : -1;
  }

  function handleComplete() {
    if (!responses) return;

    const lastStep = steps[current - 1];
    const updatedResponses = getUpdatedResponses(lastStep.id, { completed: true });

    updateOrCreateMutation.mutate({
      userId: member.userId,
      onboardingId: onboarding.data.id,
      responses: updatedResponses,
      completed: true
    }, {
      onSuccess: () => {
        onComplete();
      }
    });
  }

  function handleUpdate(stepId: number, value: PossibleValue) {
    const updatedResponses = getUpdatedResponses(stepId, value);
    setResponses(updatedResponses);
  }

  useEffect(() => {
    const lastStep = steps[current - 2];

    if (!lastStep) return;

    if (current > 1 && responses && !responses[lastStep.id]) {
      const updatedResponses = getUpdatedResponses(lastStep.id, { completed: true });
      setResponses(updatedResponses);
    }
  }, [current]);

  useEffect(() => {
    if (!responses) return;

    if (!didMount.current) {
      const lastUncompletedStep = getLastUncompletedStep(responses);
      if (lastUncompletedStep > 0) {
        setCurrent(steps[lastUncompletedStep + 1] ? lastUncompletedStep + 1 : lastUncompletedStep);
      }
      didMount.current = true;
      return;
    }

    updateOrCreateMutation.mutate({
      userId: member.userId,
      onboardingId: onboarding.data.id,
      responses: responses
    });
  }, [responses])


  if (isPendingResponses || !member || !onboarding) return;

  return (
    <Fragment>
      <div>
        <Step step={step} onUpdate={handleUpdate} value={responses?.[step.id]} />
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
          <Button className="transition-none" onClick={handleComplete} disabled={updateOrCreateMutation.isPending}>Complete</Button>
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
