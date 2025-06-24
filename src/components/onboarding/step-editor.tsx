import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import StepForm from "./step-form";
import { ChevronDown, ChevronUp } from "lucide-react";

export type RawStep = {
    id?: number;
    onboardingId?: number;
    title: string;
    description: string;
    order: number;
    type: "document" | "video" | "checklist";
    checklistId?: number;
    duration?: number;
    value?: string | File;
};

type Props = {
    initalSteps: RawStep[];
    onUpdate: (steps: RawStep[]) => void
};

export default function StepEditor({ initalSteps = [], onUpdate }: Props) {
    const [steps, setSteps] = useState<RawStep[]>([]);
    const [stepToEdit, setStepToEdit] = useState<RawStep | null>(null);

    function newStep() {
        const newStep: RawStep = {
            title: "New step title",
            description: "New step description",
            order: steps.length + 1,
            type: "document",
            duration: 0,
        };
        setSteps([...steps, newStep]);
    }

    function updateStep(index: number, updatedStep: RawStep) {
        const newSteps = [...steps];
        newSteps[index] = updatedStep;
        setSteps(newSteps);
        setStepToEdit(updatedStep);
    }

    function moveStep(index: number, direction: "up" | "down") {
        const newSteps = [...steps];
        if (direction === "up" && index > 0) {
            [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
        } else if (direction === "down" && index < newSteps.length - 1) {
            [newSteps[index + 1], newSteps[index]] = [newSteps[index], newSteps[index + 1]];
        }
        setSteps(newSteps);
        setStepToEdit(newSteps[index]);
        onUpdate(newSteps);
    }

    useEffect(() => {
        if (initalSteps.length > 0) {
            setSteps(initalSteps as RawStep[]);
        } else {
            newStep();
        }
    }, []);

    return (
        <div className="w-full flex gap-8">
            <Card className="w-1/3 h-full">
                <CardHeader>
                    <div className="flex w-full justify-between items-center">
                        <CardTitle>Steps ({steps.length})</CardTitle>
                        <Button type="button" onClick={newStep}>
                            New Step
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {steps.map((step, index) => (
                        <div
                            key={step.order}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${stepToEdit?.order === step.order
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => setStepToEdit(step)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 mb-1">{step.title}</p>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{step.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1 ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        type="button"
                                        onClick={() => moveStep(index, "up")}
                                        disabled={index === 0}
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        type="button"
                                        onClick={() => moveStep(index, "down")}
                                        disabled={index === steps.length - 1}
                                    >
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="w-2/3 h-full">
                <CardHeader>
                    <CardTitle>{stepToEdit ? `Step ${stepToEdit.order} : ${stepToEdit.title}` : "Step editing"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {stepToEdit ? (
                        <StepForm index={steps.indexOf(stepToEdit)} step={stepToEdit} onUpdate={updateStep} />
                    ) : (
                        <p>Select a step</p>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}