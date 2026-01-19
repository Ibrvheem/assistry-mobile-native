import { useMutation } from "@tanstack/react-query";
import { verifyEmailOTP } from "../services";
import { VerifyEmailOTP } from "../types";
import { router } from "expo-router";

export function useVerifyEmailOTP() {
  const mutation = useMutation({
    mutationFn: (payload: VerifyEmailOTP) => verifyEmailOTP(payload),
    onSuccess: async (data) => {
      router.replace("/(auth)/signin");
    },
    onError: (error) => {
      console.error("OTP Verification Error:", error);
    },
  });

  return {
    verifyOTP: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
