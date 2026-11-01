import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "") || "";

const api = axios.create({
    baseURL: `${configuredBaseUrl}/api`,
    withCredentials: true,
});

export default api;