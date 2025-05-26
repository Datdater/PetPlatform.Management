import axios from "axios";

const storedData = localStorage.getItem("auth-storage");
const parsedData = JSON.parse(storedData!);
const accessToken = parsedData?.state.token;

console.log("data:::", parsedData);

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`, // ✅ Add Authorization header if accessToken exists
  },
});
