"use client";

import { Onboarding } from "@/routers/onboarding";
import { postOnboarding } from "@/schemas/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import StepEditor from "./step-editor";

type OnboardingFormProps = {
    onboarding?: Onboarding;
};

export default function OnboardingForm({ onboarding }: OnboardingFormProps) {
    const form = useForm<z.infer<typeof postOnboarding>>({
        resolver: zodResolver(postOnboarding),
        defaultValues: {
            title: onboarding?.data.title || "",
            description: onboarding?.data.description || "",
        }
    })

    function handleSubmit(data: z.infer<typeof postOnboarding>) {
        console.log("Form submitted with data:", data);
        // Here you would typically call a mutation to save the onboarding data
    }

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

                    <StepEditor />
                    <Button type="submit" className="w-full">
                        {onboarding ? "Update Onboarding" : "Create Onboarding"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}