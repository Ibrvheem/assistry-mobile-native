import api from "@/lib/api";

export async function getTask(id: string) {
  const response = await api.get(`tasks/${id}`);
  return response;
}
