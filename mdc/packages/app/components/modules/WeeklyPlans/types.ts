import { z } from 'zod';

export const Schema = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  tags: z.any().optional(),
  weeklyPlans: z
    .object({
      id: z.string(),
      order: z.number(),
      dailyPlanPractices: z
        .object({
          day: z.number(),
          id: z.string(),
        })
        .array(),
    })
    .array(),
});

export type FormSchemaType = z.infer<typeof Schema>;
