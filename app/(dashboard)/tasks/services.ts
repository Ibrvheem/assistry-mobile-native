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
    throw error;
  }
}

export async function completeTask({ taskId }: { taskId: string }) {
  const response = await api.post("tasks/complete", { taskId });
  return response;
}

export async function cancelTask({ taskId }: { taskId: string }) {
  const response = await api.post("tasks/cancel", { taskId });
  return response;
}

export async function declineTask({ taskId }: { taskId: string }) {
  const response = await api.post("tasks/decline", { taskId });
  return response;
}

export async function approveTask({ taskId }: { taskId: string }) {
  const response = await api.post("tasks/acknowledge", { taskId });
  return response;
}

export async function startTask({ taskId }: { taskId: string }) {
  const response = await api.post("tasks/start", { taskId });
  return response;
}

// api is your axios instance
export async function chatTaskUser(participants: string[], taskId: string) {
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error('participants must be a non-empty array of user ids');
  }
  if (!taskId || typeof taskId !== 'string') {
    throw new Error('taskId is required and must be a string');
  }

  const payload = { participants, taskId };

  try {
    const response = await api.post('chat/rooms', payload);
    return response; // axios response body
  } catch (err: any) {
    console.error('chatTaskUser error:', err?.response?.data ?? err.message ?? err);
    // rethrow a useful error for callers
    throw err?.response?.data ?? { message: 'Failed to create chat' };
  }
}

export async function performTaskAction(taskId: string, action: string) {
  if (!["accept", "complete","start", "cancel", "decline", "acknowledge"].includes(action)) {
    throw new Error("Invalid action");
  }

  switch (action) {
    case "accept":
      return await acceptTask({ taskId });
    case "start":
      return await startTask({ taskId });
    case "complete":
      return await completeTask({ taskId });
    case "cancel":
      return await cancelTask({ taskId });
    case "decline":
      return await declineTask({ taskId });
    
    case "approve":
      return await approveTask({ taskId });
    default:
      throw new Error("Unknown action");
  }
}
