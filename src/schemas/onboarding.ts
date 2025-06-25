import z from "zod";

export const getOnboarding = z.object({
    onboardingId: z.string(),
});

export const postOnboarding = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    steps: z.array(z.object({
        title: z.string().min(1, "Step title is required"),
        type: z.enum(['document', 'video', 'checklist']),
        description: z.string().min(1, "Step description is required"),
        order: z.number().int().min(0, "Order must be a non-negative integer"),
        checklistId: z.number().optional().nullable(),
        value: z.string().or(z.instanceof(File)).optional().nullable()
    })),
    userId: z.string()
})

export const putOnboarding = z.object({
    onBoardingId: z.number(),
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
    })),
    userId: z.string()
})

export const getAllOnboardings = z.object({
    organizationId: z.string(),
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0),
});

export const deleteOnboarding = z.object({
    onboardingId: z.number(),
    userId: z.string(),
});