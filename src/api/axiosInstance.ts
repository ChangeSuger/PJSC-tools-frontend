import axios, { type AxiosResponse } from 'axios';

const TIMEOUT = 5 * 60; // second

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: TIMEOUT * 1000,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };

export type Response<T = undefined> = {
  code: number;
  data: T;
  msg: string;
};

export function successWrapper<T>(data: T): Response<T> {
  return { code: 200, data, msg: 'success' };
}

// export function errorWrapper(error: any) {
//   const { response } = error;
//   return {
//     code: response?.status ?? 500,
//     msg: (response?.data?.detail || response?.data) ?? '网络错误'
//   };
// }
