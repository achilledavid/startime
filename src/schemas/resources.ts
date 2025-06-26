import z from "zod";

export const getResources = z.object({
    id: z.string(),
})

export const postResources = z.object({
    id: z.string(),
    payload: z.object({
        title: z.string().min(2, "2 chars. min"),
        description: z.string().optional(),
        size: z.string(),
        url: z.string()
    })
})

export const deleteResources = z.object({
    url: z.string(),
})
