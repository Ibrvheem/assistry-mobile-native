import { useGobalStoreContext } from "@/store/global-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreatePasswordPayload, createPasswordPayload } from "../types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { createPassword } from "../services";

export function useCreatePasswordHook() {
  const { studentData } = useGobalStoreContext();

  const methods = useForm<CreatePasswordPayload>({
    resolver: zodResolver(createPasswordPayload),
  });

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: createPassword,
    onSuccess: async (data) => {
      router.push("/(auth)");
    },
    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });
  const onSubmit = handleSubmit((values: CreatePasswordPayload) => {
    console.log(values);
    const { confirm_password, ...rest } = values;
    mutation.mutate({ ...rest, reg_no: studentData?.reg_no ?? "" });
  });

  return {
    onSubmit,
    methods,
    loading: mutation.isPending,
  };
}
