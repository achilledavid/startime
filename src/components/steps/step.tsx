import { Onboarding } from "@/routers/onboarding";
import DocumentStep from "./document";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FileText, Video, CheckSquare, HelpCircle } from "lucide-react";
import VideoStep from "./video";
import ChecklistStep from "./checklist";

export default function Step({ step }: { step: Onboarding["steps"][number] }) {

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

function renderStepContent(step: Onboarding["steps"][number]) {
  switch (step.type) {
    case "document":
      return <DocumentStep step={step} />
    case "video":
      return <VideoStep step={step} />
    case "checklist":
      return <ChecklistStep step={step} />
    default:
      return <p>Unknown step type: {step.type}</p>
  }
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
