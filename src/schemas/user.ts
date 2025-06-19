import z from "zod";

export const userEmail = z.object({
    email: z.string().email()
})