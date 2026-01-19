import { useMutation } from "@tanstack/react-query";
import { signupStudent } from "../services";
import { SignupStudentPayload } from "../types";
import { router } from "expo-router";

export function useSignupStudent() {
  const mutation = useMutation({
    mutationFn: (payload: SignupStudentPayload) => signupStudent(payload),
    onSuccess: (data, variables) => {
      // Navigate to OTP page, passing email for verification
      router.push({
        pathname: "/(auth)/otp",
        params: { email: variables.email },
      });
    },
    onError: (error) => {
      console.error("Signup Error:", error);
    },
  });

  return {
    signup: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
