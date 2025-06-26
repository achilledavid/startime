import { Onboarding } from "@/routers/onboarding";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function DocumentStep({ step }: { step: Onboarding["steps"][number] }) {
  return (
    <div className="space-y-4">
      <Button
        asChild
        className="w-fit"
        disabled={!step.value}
      >
        <Link href={step.value!} download target="_blank">
          <Download />
          Download document
        </Link>
      </Button>
      {step.value && (
        <p className="text-xs text-muted-foreground break-all">
          URL: {step.value}
        </p>
      )}
    </div>
  );
}
