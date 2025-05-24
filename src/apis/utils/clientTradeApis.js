'use client';
import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER;

const axiosApi = (options) => {
  return axios.create({ baseURL: URL, ...options });
};

export const tradeDefaultInstance = axiosApi();
