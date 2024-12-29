import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getStudentData } from "../services";
import { useGobalStoreContext } from "@/store/global-context";
import { router } from "expo-router";
import { verifyStudentRegNo, VerifyStudentRegNo } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

export function useConfirmRegistrationNo() {
  const methods = useForm<VerifyStudentRegNo>({
    resolver: zodResolver(verifyStudentRegNo),
  });
  const { setStudentData } = useGobalStoreContext();
  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: getStudentData,
    onSuccess: (data) => {
      setStudentData(data);
      router.push("/(auth)/confirm-number");
    },
    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });
  const onSubmit = handleSubmit(async (values: VerifyStudentRegNo) => {
    mutation.mutate(values);
  });

  return {
    methods,
    onSubmit,
    error: mutation.error,
    loading: mutation.isPending,
  };
}
