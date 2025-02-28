import Cookies from "js-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "https://280a-197-210-53-14.ngrok-free.app";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
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
    const authHeader = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      ...params,
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, payload: any) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, payload: any) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PUT",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  patch: async (endpoint: string, payload: any) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PATCH",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "DELETE",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  formData: async (formData: FormData) => {
    const authHeader = await getAuthHeader();
    console.log(formData);
    const response = await fetch(`${url}/upload`, {
      method: "POST",
      headers: {
        ...authHeader,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export default api;
