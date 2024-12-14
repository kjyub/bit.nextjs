import CommonUtils from "@/utils/CommonUtils";
import axios from "axios"
import { getSession, useSession } from 'next-auth/react';

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER

const axiosApi = (options) => {
    const api = axios.create({
        baseURL: URL,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        ...options,
    })

    return api
}
export const tradeDefaultServerInstance = axiosApi()