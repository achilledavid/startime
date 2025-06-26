import { Onboarding } from "@/routers/onboarding";
import DocumentStep from "./document";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FileText, Video, CheckSquare, HelpCircle } from "lucide-react";
import VideoStep from "./video";
import ChecklistStep from "./checklist";

export type CheckboxValue = Set<string>;

export type CheckboxResponse = {
  completed: boolean;
  value: string[];
}

export type Value = {
  completed: boolean;
}

export type PossibleValue = Value | CheckboxResponse;

export default function Step({ step, onUpdate, value }: { step: Onboarding["steps"][number], onUpdate: (stepId: number, value: PossibleValue) => void, value: PossibleValue | undefined }) {

  function handleCheckboxUpdate(value: { completed: boolean, value: string[] }) {
    onUpdate(step.id, value);
  }

  function renderStepContent(step: Onboarding["steps"][number]) {
    switch (step.type) {
      case "document":
        return <DocumentStep step={step} />
      case "video":
        return <VideoStep step={step} />
      case "checklist":
        return <ChecklistStep step={step} onUpdate={handleCheckboxUpdate} value={value as CheckboxResponse} />
      default:
        return <p>Unknown step type: {step.type}</p>
    }
  }

  const StepIcon = getStepIcon(step.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <StepIcon className="size-4 text-muted-foreground" />
          {step.title}
        </CardTitle>
        <CardDescription>
          {step.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent(step)}
      </CardContent>
    </Card>
  )
}

export function getStepIcon(type: string) {
  switch (type) {
    case "document":
      return FileText
    case "video":
      return Video
    case "checklist":
      return CheckSquare
    default:
      return HelpCircle
  }
}
