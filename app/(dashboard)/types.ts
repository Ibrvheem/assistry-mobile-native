import { z } from "zod";

export const createTaskPayload = z.object({
  task: z.string(),
  description: z.string().optional(),
  incentive: z.string(),
  expires: z.string(),
  visual_context: z.string().optional(),
});
export const taskSchema = z.object({
  id: z.string(),
  task: z.string(),
  description: z.string().optional(),
  incentive: z.number(),
  expires: z.number(),
  visual_context: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CreateTaskPayload = z.infer<typeof createTaskPayload>;
export type TaskSchema = z.infer<typeof taskSchema>;
