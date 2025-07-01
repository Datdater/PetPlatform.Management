import axios from "axios";

const storedData = localStorage.getItem("auth-storage");
const parsedData = JSON.parse(storedData!);
const accessToken = parsedData?.state.token;

// Create base client with common configuration
const createClient = (baseURL: string) => {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Create specific clients for different services
export const feClient= createClient(`${import.meta.env.VITE_BACKEND_URL}`);


// Export default client for backward compatibility
export const client = feClient;
