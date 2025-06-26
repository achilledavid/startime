import { z } from "zod";

export const getChecklist = z.object({
    id: z.number(),
});

export const postChecklist = z.object({
    items: z.array(z.object({
        id: z.string(),
        text: z.string().min(1, "Item text cannot be empty"),
    }))
}).refine(data => data.items.length > 0, {
    message: "Checklist must have at least one item",
    path: ["items"],
});

export const putChecklist = z.object({
    id: z.number(),
    items: z.array(z.object({
        id: z.string(),
        text: z.string().min(1, "Item text cannot be empty"),
    }))
}).refine(data => data.items.length > 0, {
    message: "Checklist must have at least one item",
    path: ["items"],
});