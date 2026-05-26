import { z } from "zod"

export const scrapeSchema = z.object({
  query: z
    .string()
    .min(1, "Query is required"),

  limit: z
    .number()
    .min(1)
    .max(100),
})

export type ScrapeSchema =
  z.infer<typeof scrapeSchema>