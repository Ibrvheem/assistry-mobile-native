import api from "@/lib/api";
import { getMimeType } from "@/utils/mime";
import { uploadImage } from "../profile/services";

export async function getMyChats() {
  const response = await api.get("chat/rooms");
  return response;
}

export async function uploadMedia(uri: string, type: string) {
  if (type === "image") {
    const uploadResult = await uploadImage(uri);
    return uploadResult;
  }
  if (type === "audio") {
    const uploadResult = await uploadAudio(uri);
    return uploadResult;
  }
}
export async function uploadAudio(audioUri: string) {
  // const optimizedUri = await optimizeImageBeforeUpload(imageUri);

  const formData = new FormData();
  const type = getMimeType(audioUri);

  formData.append("file", {
    uri: audioUri,
    name: audioUri.split("/").pop(),
    type,
  } as any);

  const response = await api.formData(formData);
  return {
    kind: type,
    assetStorageKey: response.key as string,
    url: response.url,
  };
}

export async function getMessages(
  chatId: string,
  pageParam?: string | null,
  limit?: number | null,
) {
  const response = await api.get(`chat/rooms/${chatId}/messages`, {
    params: {
      limit: limit ?? 50, // Default limit, adjust as needed
      before: pageParam,
    },
  });
  return response; // Return the data directly
}

export async function sendMessage(payload: any) {
  const response = await api.post(`chat/messages`, payload);
  return response.data;
}

/**
 * Fetch user profile by ID.
 * Returns parsed user data (not the Axios response).
 */

export async function uploadFile(fileUri: string) {
  //   const optimizedUri = await optimizeImageBeforeUpload(imageUri);

  const formData = new FormData();
  const type = getMimeType(fileUri);

  formData.append("file", {
    uri: fileUri,
    name: fileUri.split("/").pop(),
    type,
  } as any);

  const response = await api.formData(formData);
  return {
    kind: type,
    assetStorageKey: response.key as string,
    url: response.url,
  };
}
