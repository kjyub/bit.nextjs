import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_DJANGO_SERVER;

const axiosApi = (options) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  return api;
};
const axiosNextApi = (options) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  return api;
};

export const defaultServerInstance = axiosApi();
export const defaultApiInstance = axiosNextApi();
