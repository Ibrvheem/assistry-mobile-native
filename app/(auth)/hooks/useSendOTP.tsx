import ReactDOMServer from "react-dom/server";
import { useMutation } from "@tanstack/react-query";
import { Resend } from "resend";
import PlaidVerifyIdentityEmail from "@/emails/plaid-verify-identity";
import { requestOTP } from "../services";
import { RequestOTPPayload } from "../types";
import { router } from "expo-router";

const resend = new Resend("re_CWgXYEW4_AeMvnU5vhCDXeF5L7AUaW2FQ");

export function useSendOTP(email: string, phone_no:string) {
  const mutation = useMutation({
    mutationFn: (payload: RequestOTPPayload) => requestOTP(payload),

    onSuccess: async (data) => {
      const emailContent = ReactDOMServer.renderToStaticMarkup(
        <PlaidVerifyIdentityEmail validationCode={data.otp} />
      );
      console.log(data);
      try {
        const response = await resend.emails.send({
          from: "Assistry <onboarding@resend.dev>",
          to: email,
          subject: "Phone Number Verification",
          html: emailContent,
        });
        console.warn(response);
        router.push("/(auth)/otp")
      } catch (error) {
        console.error("Error sending email", error);
      }
    },
    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });

  return {
    sendOTP: mutation.mutate,
    loading: mutation.isPending,
  };
}
