// // // app/hooks/useFund.ts
// // import { useForm } from "react-hook-form";
// // import { useMutation } from "@tanstack/react-query";
// // import { router } from "expo-router";
// // import { Dispatch, SetStateAction, useState } from "react";

// // type InitResponse = {
// //   authorization_url: string;
// //   reference: string;
// // };

// // export function useFund({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
// //   const methods = useForm();
// //   const { handleSubmit, getValues } = methods;

// //   const [payVisible, setPayVisible] = useState(false);
// //   const [payUrl, setPayUrl] = useState<string | null>(null);
// //   const [payReference, setPayReference] = useState<string | null>(null);
// //   const [payEmail, setPayEmail] = useState<string | null>(null);
// //   const [payAmount, setPayAmount] = useState<number | null>(null);
// //   const [error, setError] = useState<any>(null);

// //   // Finalize mutation (called after server verify). Keep minimal — you can expand.
// //   const finalizeMutation = useMutation({
// //     mutationFn: async (payload: any) => {
// //       // payload comes from verify endpoint
// //       return payload;
// //     },
// //     onSuccess: () => {
// //       // close modal and navigate (adjust to your UX)
// //       setOpen(false);
// //       router.push("/(dashboard)");
// //     },
// //   });

// //   const onSubmit = handleSubmit(async (values) => {
// //     setError(null);
// //     const amount = Number(values.amount ?? getValues("amount") ?? 0);
// //     // if you have user's email in context, use it. fallback:
// //     const email = String(values.email ?? getValues("email") ?? "no-reply@example.com");

// //     if (!amount || amount <= 0) {
// //       setError("Please enter a valid amount");
// //       return;
// //     }

// //     try {
      

// //       const data = j as InitResponse;
// //       setPayUrl(data.authorization_url);
// //       setPayReference(data.reference);
// //       setPayEmail(email);
// //       setPayAmount(amount);
// //       setPayVisible(true);
// //     } catch (err) {
// //       console.error("Init payment error", err);
// //       setError(String(err));
// //     }
// //   });


// //   return {
// //     onSubmit,
// //     methods,
// //     loading: finalizeMutation.isPending,
// //     error,
// //     payVisible,
// //     setPayVisible,
// //     payUrl,
// //     payReference,
// //     payEmail,
// //     payAmount,
// //   };
// // }


// import { useForm } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { router } from "expo-router";
// import { Dispatch, SetStateAction, useState } from "react";
// import { deposit} from "../(dashboard)/services";

// type InitResponse = {
//   authorization_url: string;
//   reference: string;
// };

// export function useFund({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
//   const methods = useForm();
//   const { handleSubmit, getValues } = methods;

//   const [payVisible, setPayVisible] = useState(false);
//   const [payUrl, setPayUrl] = useState<string | null>(null);
//   const [payReference, setPayReference] = useState<string | null>(null);
//   const [payEmail, setPayEmail] = useState<string | null>(null);
//   const [payAmount, setPayAmount] = useState<number | null>(null);
//   const [error, setError] = useState<any>(null);

//   const finalizeMutation = useMutation({
//     mutationFn: async (payload: any) => {
//       return payload; // could later call a verify endpoint
//     },
//     onSuccess: () => {
//       setOpen(false);
//       router.push("/(dashboard)");
//     },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     setError(null);
//     const amount = Number(values.amount ?? getValues("amount") ?? 0);
//     // // console.log(values);

//     if (!amount || amount <= 0) {
//       setError("Please enter a valid amount");
//       return;
//     }

//     try {
//       // Send to backend in kobo (₦1000 = 100000 kobo)
      

//       const data = await deposit({ amount_kobo: amount * 100 }); 
//       const init = data as InitResponse;

//       setPayUrl(init.authorization_url);
//       setPayReference(init.reference);
//       setPayEmail(values.email ?? "no-reply@example.com");
//       setPayAmount(amount);
//       setPayVisible(true);
//     } catch (err) {
//       console.error("Init payment error", err);
//       setError(String(err));
//     }
//   });

//   // // console.log('stats', finalizeMutation);

//   return {
//     onSubmit,
//     methods,
//     loading: finalizeMutation.isPending,
//     error,
//     payVisible,
//     setPayVisible,
//     payUrl,
//     payReference,
//     payEmail,
//     payAmount,
//   };
// }


import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { deposit } from "../(dashboard)/services";

type InitResponse = {
  authorization_url: string;
  reference: string;
};

export function useFund({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const methods = useForm();
  const { handleSubmit } = methods;

  const [payVisible, setPayVisible] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [payReference, setPayReference] = useState<string | null>(null);
  const [payEmail, setPayEmail] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalizeMutation = useMutation({
    mutationFn: async (values: any) => {
      const amount = Number(values.amount ?? 0);
      if (!amount || amount <= 0) throw new Error("Please enter a valid amount");

      const data = await deposit({ amount_kobo: amount * 100 });

      return {
        ...data,
        email: values.email ?? "no-reply@example.com",
        amount,
      };
    },
    onSuccess: (result: InitResponse & { email: string; amount: number }) => {
      setPayUrl(result.authorization_url);
      setPayReference(result.reference);
      setPayEmail(result.email);
      setPayAmount(result.amount);
      setPayVisible(true);
    },
    onError: (err: any) => {
      console.error("Init payment error:", err);
      setError(err?.message ?? String(err));
    },
  });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    finalizeMutation.mutate(values); // mutation now handles the async call
  });

  return {
    onSubmit,
    methods,
    loading: finalizeMutation.isPending, // true while deposit is in progress
    error,
    payVisible,
    setPayVisible,
    payUrl,
    payReference,
    payEmail,
    payAmount,
  };
}
