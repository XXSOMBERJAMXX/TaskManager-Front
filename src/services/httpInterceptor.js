const API_URL = import.meta.env.VITE_API_URL;

export const httpRequest = async (endpoint, method, body = null, customHeaders = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...customHeaders, 
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
};