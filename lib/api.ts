const url = "https://c252-197-210-70-27.ngrok-free.app";

const getAuthHeader = () => {
  return {
    Authorization: `Bearer ${""}`,
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      // Handle case where response is not JSON
      return { message: "Network response was not ok" };
    });
    throw new Error(errorData.message || "Network response was not ok");
  }
  return response.json().catch(() => {
    // Handle case where response is not JSON
    return { message: "Response was not JSON" };
  });
};

export const api = {
  get: async (endpoint: string, params?: any) => {
    const response = await fetch(`${url}/${endpoint}`, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
      ...params,
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, payload: any) => {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, payload: any) => {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  patch: async (endpoint: string, payload: any) => {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PATCH",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  formData: async (endpoint: string, formData: FormData) => {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export default api;
