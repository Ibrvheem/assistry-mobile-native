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
import { createPassword, getUser, signIn } from "../services";
import Cookies from "js-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useSignIn() {
  const { studentData, setUserData } = useGobalStoreContext();

  const methods = useForm<SignInPayload>({
    resolver: zodResolver(signInPayload),
  });

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (data: { access_token: string; user: any }) => {
      await AsyncStorage.setItem("token", data.access_token);
      console.log(data.user);
      setUserData(data.user);
      // const token = await AsyncStorage.getItem("token");

      // const user = await getUser();
      // setUserData(user);

      router.push("/(dashboard)");
      setUserData(data.user);
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
