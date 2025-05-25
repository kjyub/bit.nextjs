import { LoginResponse } from "@/types/users/UserTypes";
import BrowserUtils from "@/utils/BrowserUtils";
import axios from "axios";

// const URL = "http://172.30.1.46:8000"
// const URL = "http://127.0.0.1:8000"
const URL = process.env.NEXT_PUBLIC_DJANGO_SERVER;

const axiosApi = (options: object): axios.AxiosInstance => {
  return axios.create({ baseURL: URL, ...options });
};

const axiosCredentialApi = (options: object) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  return api;
};

const axiosAuthApi = (options: object) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // 응답 시
  api.interceptors.response.use(
    (config) => {
      return config;
    },
    async (error) => {
      const originalRequest = error.config as object;

      // 재요청 실패
      if (error.response.status === 401 && error._retry) {
        return Promise.reject(error);
      }

      // 재요청 시도
      if (error.response.status === 401 && !error._retry) {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER + "/api/auth/refresh/");
          const result = (await response.json()) as LoginResponse;

          if (!result.token.access) {
            throw Error("토큰 만료");
          }

          setAxiosAuthToken(result.token.access); // authInstance 에 저장
          originalRequest.headers["Authorization"] = `Bearer ${result.token.access}`; // 현재 재요청 헤더에 저장

          return axios(originalRequest);
        } catch {
          removeAxiosAuthToken();

          // 새로고침
          if (BrowserUtils.isClient()) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            window.location.reload();
          }

          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
  return api;
};

const axiosBothApi = (options: object) => {
  const api = axiosAuthApi(options);
  // 기존 request 를 지운다.
  api.interceptors.request.clear();
  // 요청 시
  api.interceptors.request.use(
    (config) => {
      const cookie = getCookie(ConstCookie.USER_ACCESS_TOKEN);
      if (cookie) {
        config.headers.Authorization = `Bearer ${cookie}`;
      }
      return config;
    },
    async (error) => {
      return Promise.reject(error);
    }
  );
  return api;
};

export const credentialInstance = axiosCredentialApi();
export const defaultInstance = axiosApi();
export const authInstance = axiosAuthApi();
export const defaultOrAuthInstance = axiosBothApi();
export const fileNoneAuthInstance = axiosApi({
  headers: { "Content-Type": "multipart/form-data" },
});
export const fileInstance = axiosAuthApi({
  headers: { "Content-Type": "multipart/form-data" },
});
export const downloadInstance = axiosApi({ responseType: "blob" });

export const setAxiosAuthToken = (token: string) => {
  authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const removeAxiosAuthToken = () => {
  delete authInstance.defaults.headers.common["Authorization"];
};
