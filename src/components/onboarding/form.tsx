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

type OnboardingFormProps = {
    onboarding?: Onboarding;
};

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    steps: z.array(z.object({
        id: z.number().optional().nullable(),
        title: z.string().min(1, "Step title is required"),
        type: z.enum(['document', 'video', 'checklist']),
        description: z.string().min(1, "Step description is required"),
        order: z.number().int().min(0, "Order must be a non-negative integer"),
        checklistId: z.number().optional().nullable(),
        value: z.string().or(z.instanceof(File)).optional().nullable()
    }))
})

export default function OnboardingForm({ onboarding }: OnboardingFormProps) {
    const { data: member } = useActiveMember()
    const [steps, setSteps] = useState<RawStep[]>(onboarding?.steps || []);

    console.log(onboarding?.steps)

    const createOnboarding = trpc.onboarding.post.useMutation()
    const updateOnboarding = trpc.onboarding.put.useMutation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: onboarding?.data.title || "",
            description: onboarding?.data.description || "",
        }
    })

    function handleSubmit(data: z.infer<typeof formSchema>) {
        if (!member) {
            console.error("User is not authenticated");
            return;
        }

        if (onboarding) {
            updateOnboarding.mutate({
                onBoardingId: onboarding.data.id,
                title: data.title,
                description: data.description,
                steps: data.steps || [],
                userId: member.userId
            });
        } else {
            createOnboarding.mutate({
                title: data.title,
                description: data.description,
                steps: data.steps || [],
                userId: member.userId
            });

            form.reset();
            setSteps([]);
        }
    }

    useEffect(() => {
        form.setValue("steps", steps);
    }, [steps]);

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">{onboarding ? "Edit" : "Create"} Onboarding</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full  space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter onboarding title" {...field} />
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
                                    <Input placeholder="Enter onboarding description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <StepEditor steps={steps} setSteps={setSteps} />

                    <Button type="submit" className="w-full">
                        {onboarding ? "Update Onboarding" : "Create Onboarding"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}