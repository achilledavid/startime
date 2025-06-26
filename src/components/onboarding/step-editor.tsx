import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import StepForm from "./step-form";
import { ChevronDown, ChevronUp, MoreVertical, Plus, Trash, Trash2 } from "lucide-react";
import { getStepIcon } from "../steps/step";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type RawStep = {
    id?: number;
    onboardingId?: number;
    title: string;
    description: string;
    order: number;
    type: "document" | "video" | "checklist";
    checklistId?: number | null;
    duration?: number;
    value?: string | null;
};

type Props = {
    steps: RawStep[];
    setSteps: Dispatch<SetStateAction<RawStep[]>>;
};

export default function StepEditor({ steps, setSteps }: Props) {
    const [stepToEdit, setStepToEdit] = useState<RawStep>();

    function newStep() {
        // const newStep: RawStep = {
        //     id: undefined,
        //     title: "",
        //     description: "",
        //     order: steps.length + 1,
        //     type: "document",
        //     duration: 2,
        //     checklistId: undefined,
        // };
        // setSteps([...steps, newStep]);
    }

    function updateStep(index: number, updatedStep: RawStep) {
        // const newSteps = [...steps];
        // newSteps[index] = updatedStep;
        // setSteps(newSteps);
        // setStepToEdit(updatedStep);
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
    }

    function removeStep(index: number) {
        // const newSteps = steps.filter((_, i) => i !== index);
        // setSteps(newSteps)
        setStepToEdit(undefined)
    }

    // useEffect(() => {
    //     if (steps.length > 0) {
    //         setSteps(steps)
    //     } else {
    //         newStep();
    //     }
    // }, []);

    return (
        <div className="w-full grid grid-cols-12 gap-4">
            <Card className="col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Steps</CardTitle>
                    <CardDescription>{steps.length} in total</CardDescription>
                    <CardAction>
                        <Button type="button" size="icon" onClick={newStep}>
                            <Plus />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                    {steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        return (
                            <div
                                key={step.id + "-" + step.order}
                                className={cn(
                                    "p-4 rounded-lg border cursor-pointer flex justify-between items-center gap-4",
                                    stepToEdit && (stepToEdit.order === step.order) ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-foreground")
                                }
                                onClick={() => setStepToEdit(step)}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <StepIcon className="size-4" />
                                        <p className="text-sm font-medium">{step.title || "Untitled step"}</p>
                                    </div>
                                    {step.description && <p className="text-xs opacity-50 line-clamp-2">{step.description}</p>}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => moveStep(index, "up")}><ChevronUp />Move up</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => moveStep(index, "down")}><ChevronDown />Move down</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => removeStep(index)} variant="destructive"><Trash />Remove</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
            <div className="col-span-8">
                {stepToEdit ? (
                    <Card>
                        <CardContent>
                            <StepForm key={stepToEdit.order} index={steps.indexOf(stepToEdit)} step={stepToEdit} onUpdate={updateStep} />
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">Select a step to start editing!</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
