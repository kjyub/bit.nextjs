import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER;

const axiosApi = (options) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  return api;
};
export const tradeDefaultServerInstance = axiosApi();
