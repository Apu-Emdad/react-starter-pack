// axios.ts
import axios from "axios";

let setLoader: ((loading: boolean) => void) | null = null;

export const injectLoaderSetter = (setter: (loading: boolean) => void) => {
  setLoader = setter;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (setLoader) setLoader(true);
    return config;
  },
  (error) => {
    if (setLoader) setLoader(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (setLoader) setLoader(false);
    return response;
  },
  (error) => {
    if (setLoader) setLoader(false);
    console.log(error.message);
    return Promise.reject(error);
  }
);

export default api;
