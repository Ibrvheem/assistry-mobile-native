import api from "@/lib/api";

export async function getTask(id: string) {
  const response = await api.get(`tasks/${id}`);
  return response;
}

export async function acceptTask({ taskId }: { taskId: string }) {
  try {
    const response = await api.post("tasks/accept", { taskId });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}
