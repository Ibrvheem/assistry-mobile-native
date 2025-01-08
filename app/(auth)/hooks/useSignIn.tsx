import { useGobalStoreContext } from "@/store/global-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreatePasswordPayload,
  createPasswordPayload,
  signInPayload,
  SignInPayload,
} from "../types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { createPassword, signIn } from "../services";
import Cookies from "js-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useSignIn() {
  const { studentData } = useGobalStoreContext();

  const methods = useForm<SignInPayload>({
    resolver: zodResolver(signInPayload),
  });

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (data: { access_token: string }) => {
      console.log(data);
      await AsyncStorage.setItem("token", data.access_token);

      const token = await AsyncStorage.getItem("token");
      console.log("token", token);
      router.push("/(dashboard)");
    },
    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });
  const onSubmit = handleSubmit((values: SignInPayload) => {
    mutation.mutate(values);
  });

  return {
    onSubmit,
    methods,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
