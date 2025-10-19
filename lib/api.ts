
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "https://9cbee0fd7663.ngrok-free.app";
// const url = "https://assistry-backend.onrender.com";

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
  // get: async (endpoint: string, params?: any) => {
  //   const authHeader = await getAuthHeader();
  //   // // console.log("PAYLOAD:", params);
  //   const response = await fetch(`${url}/${endpoint}`, {
  //     headers: {
  //       ...authHeader,
  //       "Content-Type": "application/json",
  //     },
  //     cache: "no-store",
  //     ...params,
  //   });
  //   return handleResponse(response);
  // },

  get: async (endpoint: string, params?: any) => {
    const authHeader = await getAuthHeader();

    // support either api.get('x', { params: {...} }) or api.get('x', {...})
    // const paramObj = params?.params ?? params ?? {};
    const raw = params?.params ?? params ?? {};
    const { _: _, ...withoutUnderscore } = raw; // drop "_" if present
    const paramObj = Object.fromEntries(
      Object.entries(withoutUnderscore).filter(([k, v]) => v !== undefined && v !== null)
    );

    // build query string
    const qs = new URLSearchParams();
    Object.entries(paramObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.append(k, String(v));
    });

    const fullUrl = `${url}/${endpoint}${qs.toString() ? `?${qs.toString()}` : ''}`;

    // // console.log('GET URL:', fullUrl);

    // console.log(qs.toString());

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        ...authHeader,
        // no Content-Type needed for GET
      },
      cache: 'no-store',
    });

//     try {
//   const urlObj = new URL(fullUrl);
//   // console.log('QUERY PARAMS:', Array.from(urlObj.searchParams.entries()));
// } catch (e) {
//   // console.log('cannot parse URL', fullUrl);
// }

// // console.log('STATUS', response.status, response.statusText);
//   // Try parse JSON first, otherwise text
//   let body;
//   try {
//     body = await response.json();
//   } catch {
//     body = await response.text();
//   }
//   // console.log('RESPONSE BODY', body);

    return handleResponse(response);
  },

  post: async (endpoint: string, payload: any) => {
    const authHeader = await getAuthHeader();
    // console.log("PAYLOAD:", payload);
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    // console.log("REPONSE:", response);
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
    // console.log(formData);
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
