// import { useForm } from "react-hook-form";
// import { postTask } from "../services";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { router } from "expo-router";
// // import { zodResolver } from "@hookform/resolvers/zod";
// import { Dispatch, SetStateAction, useState } from "react";
// // import mime from "mime";
// import { getMimeType } from "@/utils/mime";
// import api from "@/lib/api";

// export function usePostTask({
//   setOpen,
// }: {
//   setOpen: Dispatch<SetStateAction<boolean>>;
// }) {
//   const [images, setImages] = useState<string[]>([]);

//   const methods = useForm({
//     // resolver: zodResolver(createTaskSchema),
//   });

//   const { handleSubmit } = methods;

//   const mutation = useMutation({
//     mutationFn: postTask,
//     onSuccess: () => {
//       router.push("/(dashboard)");
//       setOpen(false);
//       const queryClient = useQueryClient();

//       queryClient.invalidateQueries({ queryKey: ["by-you"] });
//     },
//     onError: (error) => {
//       console.error("Error Fetching Data:", error);
//     },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     // if (images.length === 0) {
//     //   // console.log("Error: No images added");
//     //   return;
//     // }
//     try {
//       let assets: { kind: string | null; assetStorageKey: string }[] = [];

//       if (images.length !== 0) {
//         assets = await Promise.all(
//           images.map(async (image) => {
//             const formData = new FormData();
//             const type = getMimeType(image);

//             formData.append("file", {
//               uri: image,
//               name: image.split("/").pop(),
//               type,
//             } as any);

//             const response = await api.formData(formData);

//             return {
//               kind: type,
//               assetStorageKey: response.key as string,
//             };
//           // images.map(async (image) => {
//           //   const formData = new FormData();

//           //   formData.append("file", {
//           //     uri: image,
//           //     name: image.split("/").pop(),
//           //     type: mime.getType(image) || "image/jpeg",
//           //   } as any);

//           //   const response = await api.formData(formData);
//           //   return {
//           //     kind: mime.getType(image),
//           //     assetStorageKey: response.key,
//           //   };
//           })
//         );
//       }

//       const payload: any = {
//         ...values,
//         expires: Number(values.expires),
//         incentive: Number(values.incentive),
//       };

//       if (assets.length > 0) {
//         payload.assets = assets; // only include if exists
//       }

//       // console.log(payload);
//       mutation.mutate(payload);
//     } catch (error) {
//       console.error("Submit Failed:", error);
//     }


//     // try {

//     //   if (images.length != 0) {
        
      
//     //   const assets = await Promise.all(
//     //     images.map(async (image) => {
//     //       const formData = new FormData();

//     //       formData.append("file", {
//     //         uri: image,
//     //         name: image.split("/").pop(),
//     //         type: mime.getType(image) || "image/jpeg",
//     //       } as any);

//     //       const response = await api.formData(formData);
//     //       // console.log(response);
//     //       return {
//     //         kind: mime.getType(image),
//     //         assetStorageKey: response.key,
//     //       };
//     //     })
//     //   );

//     //   }

//     //   const payload = {
//     //     ...values,
//     //     assets,
//     //     expires: Number(values.expires),
//     //     incentive: Number(values.incentive),
//     //   };

//     //   // console.log(payload);
//     //   mutation.mutate(payload);
//     // } catch (error) {
//     //   console.error("Submit Failed:", error);
//     // }
//   });

//   return {
//     onSubmit,
//     methods,
//     loading: mutation.isPending,
//     error: mutation.isError,
//     images,
//     setImages,
//   };
// }




import { useForm } from "react-hook-form";
import { postTask } from "../services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { getMimeType } from "@/utils/mime";
import api from "@/lib/api";
import { optimizeImageBeforeUpload } from "@/lib/helpers";

export function usePostTask({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [images, setImages] = useState<string[]>([]);
  const methods = useForm({
    // resolver: zodResolver(createTaskSchema),
  });
  const { handleSubmit } = methods;
  const queryClient = useQueryClient();

  // Mutation handles the entire submission, including image uploads
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      let assets: { kind: string | null; assetStorageKey: string }[] = [];

      if (images.length > 0) {
        assets = await Promise.all(
          images.map(async (image) => {
            // const formData = new FormData();
            // const type = getMimeType(image);

            // formData.append("file", {
            //   uri: image,
            //   name: image.split("/").pop(),
            //   type,
            // } as any);

            const optimizedUri = await optimizeImageBeforeUpload(image);
            
            const formData = new FormData();
            const type = getMimeType(optimizedUri);
            
            formData.append("file", {
              uri: optimizedUri,
              name: optimizedUri.split("/").pop(),
              type,
            } as any);

            const response = await api.formData(formData);
            return { kind: type, assetStorageKey: response.key as string };
          })
        );
      }

      const payload = {
        ...values,
        expires: Number(values.expires),
        incentive: Number(values.incentive),
        ...(assets.length ? { assets } : {}),
      };

      return postTask(payload); // final API call
    },
    onSuccess: () => {
      router.push("/(dashboard)");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["by-you"] });
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      
    }
  });

  return {
    onSubmit,
    methods,
    loading: mutation.isPending, // true while images + task are being uploaded
    error: mutation.isError,
    images,
    setImages,
  };
}
