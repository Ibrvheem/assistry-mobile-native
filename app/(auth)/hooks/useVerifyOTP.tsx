import ReactDOMServer from "react-dom/server";
import { useMutation } from "@tanstack/react-query";
import { Resend } from "resend";
import PlaidVerifyIdentityEmail from "@/emails/plaid-verify-identity";
import { requestOTP, verifyOTP } from "../services";
import { RequestOTPPayload, VerifyOTP } from "../types";
import { router } from "expo-router";

const resend = new Resend("re_CWgXYEW4_AeMvnU5vhCDXeF5L7AUaW2FQ");

export function useVerifyOTP() {
  const mutation = useMutation({
    mutationFn: (payload: VerifyOTP) => verifyOTP(payload),
    onSuccess: async (data) => {
      router.push("/(auth)/create-password");
    },
    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });

  return {
    verifyOTP: mutation.mutate,
    loading: mutation.isPending,
  };
}
