import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/v1",
});

const attachAuthInterceptor = (instance: typeof axios | typeof api) => {
  instance.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (err) {
        console.error("Failed to retrieve session token for request:", err);
      }
    }
    return config;
  });
};

attachAuthInterceptor(api);
attachAuthInterceptor(axios);

export { api };
export default api;

