import z from "zod";

export const getOrganization = z.object({
    slug: z.string(),
    userId: z.string()
})