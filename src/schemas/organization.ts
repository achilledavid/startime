import z from "zod";

export const organizationId = z.object({
    id: z.string()
})