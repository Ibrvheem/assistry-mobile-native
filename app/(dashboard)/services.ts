import api from "@/lib/api";

export async function getByYou() {
  const response = await api.get("tasks/by-you");
  return response;
}
export async function getForYou() {
  const response = await api.get("tasks/for-you");
  return response;
}
export async function getAvailable() {
  const response = await api.get("tasks/available");
  return response;
}
export async function getUsers() {
  const response = await api.get("users");
  return response;
}
