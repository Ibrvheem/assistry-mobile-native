import api from "@/lib/api";
import { getMimeType } from "@/utils/mime";
import { UserSchema } from "../types";
import { optimizeImageBeforeUpload } from "@/lib/helpers"

/**
 * Fetch user profile by ID.
 * Returns parsed user data (not the Axios response).
 */

export async function uploadImage (imageUri: string){

  const optimizedUri = await optimizeImageBeforeUpload(imageUri);

const formData = new FormData();
const type = getMimeType(optimizedUri);

formData.append("file", {
  uri: optimizedUri,
  name: optimizedUri.split("/").pop(),
  type,
} as any);

  
              const response = await api.formData(formData);
              return { kind: type, assetStorageKey: response.key as string, url:response.url };

};

export async function getUser(id: string) {
  // // console.log("Fetching user with ID:", id);
  const { data } = await api.get(`users/${id}`);
  const response = await api.get(`users/${id}`);
    // return response;
  // // console.log("Fetched user data:", response);
  return response;
}

export async function getMe() {
  const response = await api.get(`users/me`);
  return response;
}


export async function updateUser(payload:any) {
  const response = await api.patch(`users/update-profile`,payload);

  return response;
}
// export async function getUser(id: string): Promise<UserSchema> {
//   // // console.log("Fetching user with ID:", id);
//   const { data } = await api.get(`users/${id}`);
//   const response = await api.get(`users/${id}`);
//     // return response;
//   // // console.log("Fetched user data:", response);
//   return data;
// }
