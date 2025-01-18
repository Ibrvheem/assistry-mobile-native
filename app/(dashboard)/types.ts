import { z } from "zod";

export const createTaskSchema = z.object({
  task: z.string(),
  description: z.string().optional(),
  incentive: z.string(),
  expires: z.string(),
  visual_context: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
