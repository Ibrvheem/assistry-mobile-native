import { z } from "zod";

export enum TaskStatus {
  ACCEPTED = "accepted",
  DECLINED = "declined",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
  EXPIRED = "expired",
  ONGOING = 'ongoing',
  FINISHED='finished',
}
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export const createTaskPayload = z.object({
  task: z.string(),
  description: z.string().optional(),
  incentive: z.string(),
  expires: z.string(),
  visual_context: z.string().optional(),
});
export const taskSchema = z.object({
  _id: z.string(),
  task: z.string(),
  status: z.nativeEnum(TaskStatus),
  description: z.string().optional(),
  incentive: z.number(),
  expires: z.number(),
  visual_context: z.string().optional(),
  created_at: z.string(),
  views: z.string().optional(),
  updated_at: z.string(),
  acceptedBy:z.string(),
  user: z.object({
    _id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    profile_picture: z.string().nullable(),

  }),
  location: z.string(),
  assets: z.array(
    z.object({
      url: z.string(),
      kind: z.string(),
      assetStorageKey: z.string(),
    })
  ),
});


export const transactionSchema = z.object({
  _id: z.string(), // MongoDB ObjectId serialized as string
  wallet: z.string(), // ObjectId of Wallet
  type: z.nativeEnum(TransactionType),
  amount_kobo: z.number().int().nonnegative(), // stored in kobo
  reference: z.string(), // unique identifier
  status: z.nativeEnum(TransactionStatus).default(TransactionStatus.PENDING),
  metadata: z.record(z.any()).default({}),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});
export const deposit = z.object({
  amount_kobo: z.number(),
});

export const userSchema = z.object({
  _id: z.string(),
  first_name:z.string(),
  last_name:z.string(),
  profile_picture:z.string().nullable(),
  email:z.string(),
  phone_no:z.string(),
  reg_no:z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  status:z.string()
});

export type CreateTaskPayload = z.infer<typeof createTaskPayload>;
export type TaskSchema = z.infer<typeof taskSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type Deposit = z.infer<typeof deposit>;
export type TransactionSchema= z.infer<typeof transactionSchema>;
