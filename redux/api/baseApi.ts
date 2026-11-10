import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";
import httpService from "@/utils/axios";

export interface ApiError {
  status?: number;
  message: string;
}

export interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: AxiosRequestConfig["params"];
  headers?: Record<string, string>;
}

/**
 * Runs RTK Query requests through the same axios instance as utils/api, so the
 * base URL, paths and payloads stay identical to the existing calls.
 *
 * The signed-in user's token is read from the `user-token` cookie on every
 * request, the same way the pages do before calling the API. When there's no
 * cookie, the request falls back to whatever header setAuthToken has set.
 */
const axiosBaseQuery: BaseQueryFn<ApiRequest, unknown, ApiError> = async ({
  url,
  method = "GET",
  data,
  params,
  headers,
}) => {
  const token = new Cookies().get("user-token");
  try {
    const result = await httpService.request({
      url,
      method,
      data,
      params,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    return { data: result.data };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return {
      error: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      },
    };
  }
};

/** Single RTK Query API. Feature endpoints are added with `baseApi.injectEndpoints`. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Elections", "Credit"],
  endpoints: () => ({}),
});
