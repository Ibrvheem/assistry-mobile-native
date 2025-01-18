import api from "@/lib/api";

export async function getByYou() {
  const response = await api.get("tasks/by-you");
  return response;
}
