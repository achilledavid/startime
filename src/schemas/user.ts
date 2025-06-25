import z from "zod";

export const userEmail = z.object({
    email: z.string().email()
})

export const getUser = z.object({
    id: z.string()
})