import z from "zod";

export const userEmail = z.object({
    email: z.string().email()
})

export const getUser = z.object({
    id: z.string()
})

export const updateUser = z.object({
    id: z.string(),
    name: z.string().min(2, "2 chars. min").max(128, "128 chars. max"),
    email: z.string().email()
})
