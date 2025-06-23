import z from "zod";

export const getOnboarding = z.object({
    userId: z.string(),
});

export const postOnboarding = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    steps: z.array(z.object({
        title: z.string().min(1, "Step title is required"),
        type: z.enum(['document', 'video', 'checklist']),
        description: z.string().min(1, "Step description is required"),
        order: z.number().int().min(0, "Order must be a non-negative integer"),
        checklist: z.object({
            answers: z.array(z.string()).optional(),
        }).optional(),
    }))
})
