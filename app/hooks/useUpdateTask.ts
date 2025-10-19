// // app/hooks/useUpdateTask.ts
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dispatch, SetStateAction, useState } from "react";
// import { router } from "expo-router";
// import { getMimeType } from "@/utils/mime";
// import api from "@/lib/api";

// interface UseUpdateTaskProps {
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   taskId: string;
// }

// interface UpdateTaskFormValues {
//   task: string;
//   description: string;
//   location: string;
//   incentive: string; // as input value (string)
//   expires: string;   // as input value (string)
// }

// interface UpdateTaskPayload {
//   task?: string;
//   description?: string;
//   location?: string;
//   incentive?: number;
//   expires?: number;
//   assets?: {
//     kind: string | null;
//     assetStorageKey: string;
//   }[];
// }

// export function useUpdateTask({ setOpen, taskId }: UseUpdateTaskProps) {
//   const [images, setImages] = useState<string[]>([]);
//   const methods = useForm<UpdateTaskFormValues>();
//   const { handleSubmit } = methods;
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: async (values: UpdateTaskFormValues) => {
//       let assets: { kind: string | null; assetStorageKey: string }[] = [];

//       // Upload any new local images (skip existing remote ones)
//       if (images.length > 0) {
//         const uploadable = images.filter((img) => !img.startsWith("https://"));
//         if (uploadable.length > 0) {
//           const uploadedAssets = await Promise.all(
//             uploadable.map(async (image) => {
//               const formData = new FormData();
//               const type = getMimeType(image);

//               formData.append("file", {
//                 uri: image,
//                 name: image.split("/").pop() ?? "image.jpg",
//                 type,
//               } as any);

//               const response = await api.formData(formData);
//               return { kind: type, assetStorageKey: response.key as string };
//             })
//           );
//           assets = uploadedAssets;
//         }
//       }

//       // console.log("images length:", images.length);

//       // console.log("Assets to update:", assets);

//       const payload: UpdateTaskPayload = {
//         ...values,
//         expires: Number(values.expires),
//         incentive: Number(values.incentive),
//         ...(assets.length ? { assets } : {}),
//       };


//       // PATCH to update task
//       const response = await api.patch(`tasks/${taskId}`, payload);
//       return response;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["task", taskId] });
//       queryClient.invalidateQueries({ queryKey: ["by-you"] });
//       setOpen(false);
//       router.push("/(dashboard)/tasks");
//     },
//     onError: (error) => {
//       console.error("Error updating task:", error);
//       alert(error);
//     },
//   });

// // const mutation = useMutation({
// //   mutationFn: async (values: UpdateTaskFormValues) => {
// //     // --- 1️⃣ Ensure we have a task and any existing assets ---
// //     const existingAssets = task?.assets ?? [];

// //     // --- 2️⃣ Normalize URLs for consistent matching ---
// //     const normalizeUrl = (url: string) =>
// //       url.replace("auto/upload", "image/upload");

// //     // --- 3️⃣ Keep track of which image URLs are still visible in UI ---
// //     const currentImageUrls = new Set(images.map(normalizeUrl));

// //     // --- 4️⃣ Filter existing remote assets to keep only the still-visible ones ---
// //     const retainedAssets = existingAssets.filter((asset) =>
// //       currentImageUrls.has(normalizeUrl(asset.url))
// //     );

// //     // console.log("🧠 Retained assets:", retainedAssets);

// //     // --- 5️⃣ Upload any new (local) images ---
// //     const newUploads =
// //       images.length > 0
// //         ? await Promise.all(
// //             images
// //               .filter((img) => !img.startsWith("https://"))
// //               .map(async (image) => {
// //                 const formData = new FormData();
// //                 const type = getMimeType(image);

// //                 formData.append("file", {
// //                   uri: image,
// //                   name: image.split("/").pop() ?? "image.jpg",
// //                   type,
// //                 } as any);

// //                 const response = await api.formData(formData);

// //                 // console.log("✅ Uploaded new image:", response.key);

// //                 return {
// //                   kind: type,
// //                   assetStorageKey: response.key as string,
// //                 };
// //               })
// //           )
// //         : [];

// //     // --- 6️⃣ Merge retained + newly uploaded assets ---
// //     const assets = [
// //       ...retainedAssets.map((a) => ({
// //         kind: a.kind,
// //         assetStorageKey: a.assetStorageKet, // original backend key field
// //       })),
// //       ...newUploads,
// //     ];

// //     // console.log("📦 Final assets being sent:", assets);

// //     // --- 7️⃣ Prepare payload ---
// //     const payload: UpdateTaskPayload = {
// //       ...values,
// //       expires: Number(values.expires),
// //       incentive: Number(values.incentive),
// //       ...(assets.length ? { assets } : {}),
// //     };

// //     // console.log("🚀 Updating task with payload:", payload);

// //     // --- 8️⃣ Send PATCH request ---
// //     const response = await api.patch(`/tasks/${taskId}`, payload);
// //     return response;
// //   },

// //   // --- 9️⃣ React Query success & error handlers ---
// //   onSuccess: () => {
// //     queryClient.invalidateQueries({ queryKey: ["task", taskId] });
// //     queryClient.invalidateQueries({ queryKey: ["by-you"] });
// //     setOpen(false);
// //     router.push("/(dashboard)/tasks");
// //   },

// //   onError: (error) => {
// //     console.error("❌ Error updating task:", error);
// //     alert(`Failed to update task: ${error}`);
// //   },
// // });

  

//   // handleSubmit will pass form data to mutateAsync
//   const onSubmit = async (values: UpdateTaskFormValues) => {
//     try {
//       await mutation.mutateAsync(values);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return {
//     onSubmit,
//     methods,
//     loading: mutation.isPending,
//     error: mutation.isError ? mutation.error : null,
//     images,
//     setImages,
//   };
// }


// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dispatch, SetStateAction, useState } from "react";
// import { router } from "expo-router";
// import { getMimeType } from "@/utils/mime";
// import api from "@/lib/api";
// import { TaskSchema } from "@/app/(dashboard)/types";

// interface UseUpdateTaskProps {
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   taskId: string;
//   task: TaskSchema; // ✅ added so we can access existing assets
// }

// interface UpdateTaskFormValues {
//   task: string;
//   description: string;
//   location: string;
//   incentive: string;
//   expires: string;
// }

// interface UpdateTaskPayload {
//   task?: string;
//   description?: string;
//   location?: string;
//   incentive?: number;
//   expires?: number;
//   assets?: {
//     kind: string | null;
//     assetStorageKey: string;
//   }[];
// }

// export function useUpdateTask({ setOpen, taskId, task }: UseUpdateTaskProps) {
//   const [images, setImages] = useState<string[]>([]);
//   const methods = useForm<UpdateTaskFormValues>();
//   const { handleSubmit } = methods;
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: async (values: UpdateTaskFormValues) => {
//       // --- 1️⃣ Existing remote assets from task ---
//       const existingAssets = task?.assets ?? [];

//       // --- 2️⃣ Normalize Cloudinary URLs for comparison ---
//       const normalizeUrl = (url: string): string =>
//         url.replace("auto/upload", "image/upload");

//       // --- 3️⃣ Retain only assets still shown in UI ---
//       const retainedAssets = existingAssets.filter(
//         (asset) =>
//           images.some((img) => normalizeUrl(img) === normalizeUrl(asset.url))
//       );

//       // --- 4️⃣ Upload any new (local) images ---
//       const newUploads =
//         images.length > 0
//           ? await Promise.all(
//               images
//                 .filter((img) => !img.startsWith("https://"))
//                 .map(async (image: string) => {
//                   const formData = new FormData();
//                   const type = getMimeType(image);

//                   formData.append("file", {
//                     uri: image,
//                     name: image.split("/").pop() ?? "image.jpg",
//                     type,
//                   } as any);

//                   const response = await api.formData(formData);

//                   return {
//                     kind: type,
//                     assetStorageKey: response.key as string,
//                   };
//                 })
//             )
//           : [];

//       // --- 5️⃣ Merge retained + new uploads ---
//       const assets = [
//         ...retainedAssets.map((a) => ({
//           kind: a.kind ?? null,
//           assetStorageKey: a.assetStorageKey  ?? "",
//         })),
//         ...newUploads,
//       ];

//       // --- 6️⃣ Construct payload ---
//       const payload: UpdateTaskPayload = {
//         ...values,
//         expires: Number(values.expires),
//         incentive: Number(values.incentive),
//         ...(assets.length ? { assets } : {}),
//       };

//       // console.log("🚀 Final update payload:", payload);

//       // --- 7️⃣ PATCH to backend ---
//       const response = await api.patch(`/tasks/${taskId}`, payload);
//       return response;
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["task", taskId] });
//       queryClient.invalidateQueries({ queryKey: ["by-you"] });
//       setOpen(false);
//       router.push("/(dashboard)/tasks");
//     },

//     onError: (error: unknown) => {
//       console.error("❌ Error updating task:", error);
//       alert(`Failed to update task: ${String(error)}`);
//     },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     try {
//       await mutation.mutateAsync(values);
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   return {
//     onSubmit,
//     methods,
//     loading: mutation.isPending,
//     error: mutation.isError ? mutation.error : null,
//     images,
//     setImages,
//   };
// }


import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { router } from "expo-router";
import { getMimeType } from "@/utils/mime";
import api from "@/lib/api";
import { TaskSchema } from "@/app/(dashboard)/types";
import { optimizeImageBeforeUpload } from "@/lib/helpers";

interface UseUpdateTaskProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  taskId: string;
  task: TaskSchema;
}

interface UpdateTaskFormValues {
  task: string;
  description: string;
  location: string;
  incentive: string;
  expires: string;
}

interface UpdateTaskPayload {
  task?: string;
  description?: string;
  location?: string;
  incentive?: number;
  expires?: number;
  assets?: {
    kind: string | null;
    assetStorageKey: string;
  }[];
}

export function useUpdateTask({ setOpen, taskId, task }: UseUpdateTaskProps) {
  const [images, setImages] = useState<string[]>([]);
  const methods = useForm<UpdateTaskFormValues>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: UpdateTaskFormValues) => {
      // --- 1️⃣ Get existing assets from task
      const existingAssets = task?.assets ?? [];

      // --- 2️⃣ Normalize URLs for comparison
      const normalizeUrl = (url: string): string =>
        url.replace("auto/upload", "image/upload");

      // --- 3️⃣ Keep only assets still shown in UI
      const retainedAssets = existingAssets.filter((asset) =>
        images.some((img) => normalizeUrl(img) === normalizeUrl(asset.url))
      );

      // --- 4️⃣ Upload new local images
      const newUploads =
        images.length > 0
          ? await Promise.all(
              images
                .filter((img) => !img.startsWith("https://"))
                .map(async (image: string) => {
                //   const formData = new FormData();
                //   const type = getMimeType(image);

                //   formData.append("file", {
                //     uri: image,
                //     name: image.split("/").pop() ?? "image.jpg",
                //     type,
                //   } as any);

                  const optimizedUri = await optimizeImageBeforeUpload(image);

const formData = new FormData();
const type = getMimeType(optimizedUri);

formData.append("file", {
  uri: optimizedUri,
  name: optimizedUri.split("/").pop(),
  type,
} as any);

                  const response = await api.formData(formData);

                  

                  return {
                    kind: type,
                    assetStorageKey: response.key as string,
                  };
                })
            )
          : [];

      // --- 5️⃣ Merge retained + new uploads
      const assets = [
        ...retainedAssets.map((a) => ({
          kind: a.kind ?? null,
          assetStorageKey: a.assetStorageKey ?? "", // backend key field
        })),
        ...newUploads,
      ];

      // --- 6️⃣ Prepare final payload
      const payload: UpdateTaskPayload = {
        ...values,
        expires: Number(values.expires),
        incentive: Number(values.incentive),
        ...(assets.length ? { assets } : {}),
      };

      // console.log("🚀 Final update payload:", payload);

      // --- 7️⃣ PATCH request
      const response = await api.patch(`tasks/${taskId}`, payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["by-you"] });
      setOpen(false);
      router.push("/(dashboard)/tasks");
    },

    onError: (error: unknown) => {
      console.error("❌ Error updating task:", error);
      alert(`Failed to update task: ${String(error)}`);
    },
  });

  // ✅ Strongly typed submit handler (SubmitHandler<UpdateTaskFormValues>)
  const onSubmit: SubmitHandler<UpdateTaskFormValues> = async (values) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    onSubmit,
    methods,
    loading: mutation.isPending,
    // error: mutation.isError ? mutation.error : null,
    error: mutation.isError
    ? (mutation.error instanceof Error
        ? mutation.error.message
        : String(mutation.error))
    : null,
    images,
    setImages,
  };
}
