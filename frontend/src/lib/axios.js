import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:3000/api/v1"
      : "/api/v1",
  withCredentials: true,
});
