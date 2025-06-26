"use client";

import { Onboarding } from "@/routers/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import StepEditor, { RawStep } from "./step-editor";
import { trpc } from "@/app/_trpc/client";
import { useActiveMember } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { redirect } from "next/navigation";

type OnboardingFormProps = {
    onboarding?: Onboarding;
    onSuccess?: () => void;
};

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    steps: z.array(z.object({
        id: z.number().optional().nullable(),
        title: z.string().min(1, "Step title is required"),
        type: z.enum(['document', 'video', 'checklist']),
        description: z.string().min(1, "Step description is required"),
        order: z.number().int().min(0, "Order must be a non-negative integer"),
        checklistId: z.number().optional().nullable(),
        value: z.string().optional().nullable()
    }))
})

export default function OnboardingForm({ onboarding, onSuccess }: OnboardingFormProps) {
    const { data: member } = useActiveMember()
    const [steps, setSteps] = useState<RawStep[]>(onboarding?.steps || []);

    const createOnboarding = trpc.onboarding.post.useMutation()
    const updateOnboarding = trpc.onboarding.put.useMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: onboarding?.data.title || "",
            description: onboarding?.data.description || "",
            steps: onboarding?.steps || [],
        }
    })

    function handleSubmit(data: z.infer<typeof formSchema>) {
        if (onboarding) {
            updateOnboarding.mutate({
                onBoardingId: onboarding.data.id,
                title: data.title,
                description: data.description,
                steps: data?.steps || [],
                userId: member?.userId || ""
            }, { onSuccess });
        } else {
            createOnboarding.mutate({
                title: data.title,
                description: data.description,
                steps: data.steps,
                userId: member?.userId || ""
            }, { onSuccess });
        }
    }

    useEffect(() => {
        form.setValue("steps", steps);
    }, [steps, form]);

    useEffect(() => {
        if (!onboarding) {
            const defaultStep: RawStep = {
                id: undefined,
                title: "",
                description: "",
                type: "document",
                order: 0,
                checklistId: null,
                value: null
            };
            setSteps([defaultStep]);
        }
    }, [onboarding])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 grid grid-cols-12 gap-x-4">
                <div className="col-span-4 space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-12">
                    <StepEditor steps={steps} setSteps={setSteps} />
                </div>

                <Button type="submit" className="w-full col-span-12" disabled={createOnboarding.isPending || updateOnboarding.isPending}>
                    {onboarding ? "Save" : "Create"}
                </Button>
            </form>
        </Form>
    );
}
