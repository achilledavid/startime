import z from "zod";

export const getOrganization = z.object({
    slug: z.string(),
    userId: z.string()
})

export const putColor = z.object({
    slug: z.string(),
    color: z.string()
});
