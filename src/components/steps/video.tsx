import { Onboarding } from "@/routers/onboarding";

export default function VideoStep({ step }: { step: Onboarding["steps"][number] }) {
  return (
    step.value && (
      <video
        controls
        className="w-full max-w-4xl mx-auto my-8 rounded-lg"
        preload="metadata"
      >
        <source src={step.value} type="video/mp4" />
        <source src={step.value} type="video/webm" />
        <source src={step.value} type="video/ogg" />
        Your browser does not support video playback.
      </video>
    )
  );
}
