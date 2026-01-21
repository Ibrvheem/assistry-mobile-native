import api from "@/lib/api";
import {
  CreatePasswordPayload,
  RequestOTPPayload,
  VerifyOTP,
  VerifyStudentRegNo,
  SignupStudentPayload,
  VerifyEmailOTP,
} from "./types";

export function getUser() {
  const response = api.get("users/me");
  return response;
}
export function getContact(id: string) {
  const response = api.get(`users/${id}`);
  return response;
}
export function getStudentData(payload: VerifyStudentRegNo) {
  // // // console.log("Sending request to:", payload);
  const response = api.post("udus", payload);
  // // // console.log("Sending request to:", response);
  return response;
}

// export function requestOTP(payload: RequestOTPPayload) {
//   const response = api.post("auth/send-otp", payload);

//   return response;
// }
// export function verifyOTP(payload: VerifyOTP) {
//   const response = api.post("auth/verify-otp", payload);
//   return response;
// }

export function requestOTP(payload: RequestOTPPayload) {
  // // // console.log('PAYLOAD', payload);
  const response = api.post("otp/send", payload);
  // // // console.log('response', response);

  return response;
}
export function verifyOTP(payload: VerifyOTP) {
  const response = api.post("otp/verify", payload);
  return response;
}

export function signIn(payload: CreatePasswordPayload) {
  console.log("payload", payload);
  const response = api.post("auth/signin", payload);
  console.log(" SignIn response", response);
  return response;
}

export function createPassword(payload: CreatePasswordPayload) {
  const response = api.post("auth/signup", payload);
  return response;
}

export function getInstitutions() {
  const response = api.get("institution");
  return response;
}

export function signupStudent(payload: SignupStudentPayload) {
  const response = api.post("auth/signup-student", payload);
  return response;
}

export function verifyEmailOTP(payload: VerifyEmailOTP) {
  const response = api.post("auth/verify-otp", payload);
  return response;
}

export function forgotPassword(email: string) {
  const response = api.post("auth/forgot", { email });
  return response;
}

export function resetPassword(payload: any) {
  const response = api.post("auth/reset", payload);
  return response;
}

export function updateProfile(payload: any) {
  const response = api.patch("users/update-profile", payload);
  return response;
}
