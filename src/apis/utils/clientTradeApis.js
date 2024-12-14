"use client"

import CommonUtils from "@/utils/CommonUtils"
import axios from "axios"
import { getSession, signIn, useSession } from "next-auth/react"

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER

const axiosApi = (options) => {
    return axios.create({ baseURL: URL, ...options })
}

export const tradeDefaultInstance = axiosApi()