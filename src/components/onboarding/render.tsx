"use client";

import { trpc } from "@/app/_trpc/client";
import { Onboarding } from "@/routers/onboarding";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useActiveMember } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export type AnswersFromChecklist = Answer[]

type Answer = {
    id: string;
    text: string;
    isChecked?: boolean;
};

type Response = {
    completed: boolean;
    answers?: Answer[];
};

export default function OnboardingComponent({ onboarding }: { onboarding: Onboarding }) {
    const { isPending: isPosting, mutate: postResponse, data: savedResponses } = trpc.onboarding.postResponse.useMutation();
    const { isPending: isUpdating, mutate: putResponse } = trpc.onboarding.putResponse.useMutation();
    const [currentStep, setCurrentStep] = useState(0);
    const steps = onboarding.steps || [];
    const [responses, setResponses] = useState<Record<string, Response>>({});
    const { data: member } = useActiveMember();
    const [existingResponses, setExistingResponses] = useState<Record<string, Response>>({});
    const { isPending: isGetting, data: initialResponses, refetch: refetchResponses } = trpc.onboarding.getResponses.useQuery({
        userId: member?.userId || "",
        onboardingId: onboarding.data.id,
    });

    function onStepUpdate(response: Response) {
        setResponses((prev) => ({
            ...prev,
            [steps[currentStep].order]: response,
        }));
    }

    function handleNext(stepIndex: number) {
        if (responses[steps[stepIndex].order] === undefined) {
            setResponses((prev) => ({
                ...prev,
                [steps[stepIndex].order]: {
                    ...prev[steps[stepIndex].order],
                    completed: true,
                },
            }));
        }

        if (stepIndex < steps.length - 1) {
            setCurrentStep(stepIndex + 1);
        } else {
            putResponse({
                userId: member?.userId || "",
                onboardingId: onboarding.data.id,
                responses: responses,
                completed: true,
            });
        }
    }

    function renderStep() {
        const step = steps[currentStep];
        if (!step) return <div>No step available.</div>;

        const existingResponse = existingResponses[step.order] || null;

        switch (step.type) {
            case "document":
                return <DocumentStep step={step} />;
            case "video":
                return <VideoStep step={step} />;
            case "checklist":
                return <ChecklistStep step={step} onUpdate={onStepUpdate} existingResponse={existingResponse} />;
            default:
                return <div>Unknown step type: {step.type}</div>;
        }
    }

    useEffect(() => {
        if (!member || isPosting || isUpdating || isGetting) {
            return;
        }

        const existingResponsesEmpty = Object.keys(existingResponses).length === 0;

        if (existingResponsesEmpty) {
            postResponse({
                userId: member.userId,
                onboardingId: onboarding.data.id,
                responses: responses,
            });
        } else {
            if (initialResponses && initialResponses.completed) {
                return;
            }
            putResponse({
                userId: member.userId,
                onboardingId: onboarding.data.id,
                responses: responses,
            });
        }
    }, [responses]);

    useEffect(() => {
        if (savedResponses) {
            setExistingResponses(savedResponses.value as Record<string, Response>);
        }
    }, [savedResponses]);

    useEffect(() => {
        refetchResponses()
    }, [member])

    useEffect(() => {
        if (initialResponses) {
            const initialResponsesMap: Record<string, Response> = initialResponses.value as Record<string, Response>;
            setExistingResponses(initialResponsesMap);
            setResponses(initialResponsesMap);

            // fin last step that has a response and had completed true
            const lastCompletedStep = Object.keys(initialResponsesMap).reduce((last, key) => {
                const response = initialResponsesMap[key];
                if (response.completed && parseInt(key) > last) {
                    return parseInt(key);
                }
                return last;
            }, -1);

            if (lastCompletedStep >= 0) {
                setCurrentStep(lastCompletedStep - 1);
            }
        }
    }, [initialResponses]);

    return (
        <div className="onboarding-container">
            <h1 className="text-2xl font-bold mb-4">{onboarding.data.title}</h1>
            <p className="mb-6">{onboarding.data.description}</p>
            {initialResponses?.completed && (
                <div className="alert alert-success mb-4">
                    <p className="text-green-600">You have completed the onboarding process!</p>
                </div>
            )}
            {isGetting ? (
                <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            ) : (
                <>
                    <div className="steps-container">
                        {renderStep()}
                    </div>
                    <div className="navigation-buttons mt-4">
                        <Button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={currentStep <= 0}
                        >
                            Previous
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleNext(currentStep)}
                            disabled={currentStep >= steps.length}
                        >
                            {currentStep < steps.length - 1 ? "Next" : isPosting ? "Submitting..." : "Finish"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

function DocumentStep({ step }: { step: Onboarding["steps"][number] }) {
    return (
        <div className="document-step">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p>{step.description}</p>
            {step.value && (
                <Link href={step.value} target="_blank" rel="noopener noreferrer">
                    View Document
                </Link>
            )}
        </div>
    );
}

function VideoStep({ step }: { step: Onboarding["steps"][number] }) {
    return (
        <div className="video-step">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p>{step.description}</p>
            {step.value && (
                <video controls className="w-full mt-2">
                    <source src={step.value} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

function ChecklistStep({ step, onUpdate, existingResponse }: { step: Onboarding["steps"][number]; onUpdate: (response: Response) => void; existingResponse: Response | null }) {
    const existingChecks = existingResponse?.answers?.reduce((acc: Record<string, boolean>, answer: Answer) => {
        acc[answer.id] = answer.isChecked || false;
        return acc;
    }, {}) || {};

    const checkedIds = [];

    for (const [id, isChecked] of Object.entries(existingChecks)) {
        if (isChecked) {
            checkedIds.push(id);
        }
    }

    const [checkedDatas, setCheckedDatas] = useState<string[]>(checkedIds);

    const { data: checklist, isPending } = trpc.checklist.get.useQuery({
        id: step.checklistId || 0,
    });

    function onCheckboxChange(e: React.ChangeEvent<HTMLInputElement>, answerId: string) {
        const isChecked = e.target.checked;

        setCheckedDatas(prev => {
            if (isChecked) {
                return [...prev, answerId];
            } else {
                return prev.filter(id => id !== answerId);
            }
        });
    }

    useEffect(() => {
        const answers: AnswersFromChecklist = checklist?.data.answers as AnswersFromChecklist;

        if (!answers) {
            return;
        }

        if (checkedDatas.length === 0) {
            return;
        }

        const updatedAnswers = answers.map((answer: Answer) => {
            return {
                ...answer,
                isChecked: checkedDatas.includes(answer.id),
            };
        });

        if (!updatedAnswers) return;

        onUpdate({
            answers: updatedAnswers,
            completed: checkedDatas.length === answers.length
        });
    }, [checkedDatas]);

    const answers: AnswersFromChecklist = checklist?.data.answers as AnswersFromChecklist;

    return (
        <div className="checklist-step">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p>{step.description}</p>
            {step.checklistId && (
                <ul className="checklist">
                    {isPending ? (
                        <li>Loading checklist...</li>
                    ) : (
                        answers.map((answer: Answer) => (
                            <li key={answer.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={checkedDatas.includes(answer.id)}
                                    onChange={(e) => onCheckboxChange(e, answer.id)}
                                    className="mr-2"
                                />
                                {answer.text}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}