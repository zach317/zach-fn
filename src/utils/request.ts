import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const request: AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: "/api",
});

const excludeRouter: string[] = ["/"];

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const authorization = response.headers["authorization"];
    if (authorization) {
      localStorage.setItem("token", authorization);
    }
    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.clear();
      const currentPath = window.location.pathname;
      if (!excludeRouter.includes(currentPath)) {
        window.location.pathname = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default request;
