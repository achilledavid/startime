import { Onboarding } from "@/routers/onboarding";
import { Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { AnswersFromChecklist } from "../onboarding/render";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { CheckboxResponse } from "./step";

export default function ChecklistStep({ step, onUpdate, value }: { step: Onboarding["steps"][number], onUpdate: (value: { completed: boolean, value: string[] }) => void, value: CheckboxResponse | undefined }) {
  const { data, isPending } = trpc.checklist.get.useQuery({ id: step?.checklistId || 0 }, { enabled: !!step.checklistId });
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(value?.value));
  const answers: AnswersFromChecklist = data?.data.answers as AnswersFromChecklist;
  const hasSetInitialValue = useRef(false);

  useEffect(() => {
    if (!answers) return;

    const isCompleted = answers.every(answer => checkedItems.has(answer.id));

    onUpdate({
      completed: isCompleted,
      value: Array.from(checkedItems)
    });
  }, [checkedItems]);

  useEffect(() => {
    if (!value) return;

    if (hasSetInitialValue.current) return;

    hasSetInitialValue.current = true;

    const initialCheckedItems = new Set(value.value);
    setCheckedItems(initialCheckedItems);
  }, [value]);

  if (!data) return

  if (isPending) return <div className="min-h-40 flex items-center justify-center"><Loader2 className="size-4 animate-spin" /></div>

  const handleCheckboxChange = (answerId: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(answerId);
    } else {
      newCheckedItems.delete(answerId);
    }
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="space-y-3">
      {answers.map((answer) => {
        const isChecked = checkedItems.has(answer.id);

        return (
          <div
            key={answer.id}
            className={`flex items-center gap-4 px-4 min-h-12 rounded-lg border transition-all duration-200 cursor-pointer font-medium
              ${isChecked
                ? 'bg-primary/10 border-primary'
                : 'bg-card'
              }`}
            onClick={() => handleCheckboxChange(answer.id, !isChecked)}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckboxChange(answer.id, checked as boolean)}
              className="cursor-pointer"
            />
            <p className={`text-sm leading-relaxed flex-1 ${isChecked ? 'text-primary' : ''}`}>
              {answer.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
