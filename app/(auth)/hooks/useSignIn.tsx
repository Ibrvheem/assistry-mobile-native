// import { useGobalStoreContext } from "@/store/global-context";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   CreatePasswordPayload,
//   createPasswordPayload,
//   signInPayload,
//   SignInPayload,
// } from "../types";
// import { useMutation } from "@tanstack/react-query";
// import { router } from "expo-router";
// import { createPassword, getUser, signIn } from "../services";
// // import Cookies from "js-cookie";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export function useSignIn() {
//   const { studentData, setUserData } = useGobalStoreContext();

//   const methods = useForm<SignInPayload>({
//     resolver: zodResolver(signInPayload),
//   });

//   const { handleSubmit } = methods;

//   const mutation = useMutation({
//     mutationFn: signIn,
//     onSuccess: async (data: { access_token: string; user: any }) => {
//       await AsyncStorage.setItem("token", data.access_token);

//       await AsyncStorage.setItem("userData", JSON.stringify(data.user));
//       // // console.log(data.user);


//       // const token = await AsyncStorage.getItem("token");

//       // const user = await getUser();
//       // setUserData(user);

//       router.push("/(dashboard)");
//       // console.log("MY USER",data.user)
//       setUserData(data.user);
//     },
//     onError: (error) => {
//       console.error("Error Fetching Data:", error);
//     },
//   });
//   const onSubmit = handleSubmit((values: SignInPayload) => {
//     mutation.mutate(values);
//   });

//   return {
//     onSubmit,
//     methods,
//     loading: mutation.isPending,
//     error: mutation.error,
//   };
// }

import { useGobalStoreContext } from "@/store/global-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  signInPayload,
  SignInPayload,
} from "../types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { signIn } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useSignIn() {
  const { setUserData } = useGobalStoreContext();

  const methods = useForm<SignInPayload>({
    resolver: zodResolver(signInPayload),
  });

  const mutation = useMutation({
    mutationFn: signIn,

    onSuccess: async (data: { access_token: string; user: any }) => {
      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("userData", JSON.stringify(data.user));

      setUserData(data.user);
      router.push("/(dashboard)");
    },

    onError: (error) => {
      console.error("Error Fetching Data:", error);
    },
  });

  // ⛔ This is no longer a React-Hook-Form handleSubmit wrapper
  // ✅ onSubmit now accepts a raw payload from the component
  const onSubmit = (payload: SignInPayload) => {
    mutation.mutate(payload);
  };

  return {
    onSubmit,       // accepts raw values
    methods,        // contains control + handleSubmit
    loading: mutation.isPending,
    error: mutation.error,
  };
}
