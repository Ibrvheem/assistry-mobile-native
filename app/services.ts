import api from "@/lib/api";

export async function fetchAvatar() {
  return fetch("https://www.tapback.co/api/avatar").then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch avatar");
    }
    return response;
  });
}
export async function postTask(data: any) {
  try {
    const response = await api.post("tasks", data);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
