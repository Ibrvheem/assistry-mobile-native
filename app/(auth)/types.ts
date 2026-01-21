import { z } from "zod";

export const verifyStudentRegNo = z.object({
  reg_no: z.string(),
});
export const studentDataSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phone_no: z.string(),
  reg_no: z.string(),
});
export const requestOTPPayload = z.object({
  email: z.string().email(),
  phone_no: z.string(),
});
// export const verifyOTP = z.object({
//   email: z.string().email(),
//   otp: z.string(),
// });

export const verifyOTP = z.object({
  pin_id: z.string(),
  code: z.string(),
});
export const signInPayload = z.object({
  reg_no: z.string(),
  password: z.string(),
  // push_token: z.string().nullish(),
  push_token: z.string().nullable().optional(),
});

export const createPasswordPayload = z
  .object({
    password: z.string(),
    // .min(8, "Password must be at least 8 characters long")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(
    //   /[^A-Za-z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    confirm_password: z.string().optional(),
    reg_no: z.string().optional(),
    push_token: z.string().nullish(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"], // Error will be shown for the confirm_password field
    message: "Passwords do not match",
  });

export const userDataSchema = z.object({
  _id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string().optional(),
  email: z.string(),
  phone_no: z.string(),
  profile_picture: z.string().nullable(),
  dob: z.string().or(z.date()).optional(),
  id_card_url: z.string().optional(),
  preferred_task_categories: z.array(z.string()).optional(),
  push_token: z.string().optional(),
  is_online: z.boolean().optional(),
});

export type UserDataSchema = z.infer<typeof userDataSchema>;
export type StudentData = z.infer<typeof studentDataSchema>;
export type RequestOTPPayload = z.infer<typeof requestOTPPayload>;
export type VerifyStudentRegNo = z.infer<typeof verifyStudentRegNo>;
export type VerifyOTP = z.infer<typeof verifyOTP>;
export type CreatePasswordPayload = z.infer<typeof createPasswordPayload>;
export type SignInPayload = z.infer<typeof signInPayload>;

export const signupStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  reg_no: z.string().min(1, "Registration number is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  department: z.string().min(1, "Department is required"),
  phone_no: z.string().min(10, "Phone number is required"),
  level: z.string().min(1, "Level is required"),
  gender: z.string().min(1, "Gender is required"),
  state: z.string().min(1, "State is required"),
  institution: z.string().min(1, "Institution is required"),
});

export type SignupStudentPayload = z.infer<typeof signupStudentSchema>;

export const verifyEmailOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  purpose: z.string().optional(),
});

export type VerifyEmailOTP = z.infer<typeof verifyEmailOTPSchema>;

export interface Institution {
  id: string; // or _id depending on backend
  name: string;
  // add other fields if necessary
}
