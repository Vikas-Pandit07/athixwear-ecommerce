const BASE_URL = "http://localhost:9090";

export const apiRequest = async (
  // api path
  endpoint,
  { method = "GET", body = null, headers = {} } = {}, // prevents crash if second argument is missing
) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
