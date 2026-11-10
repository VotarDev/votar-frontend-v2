import { baseApi } from "./baseApi";
import { getCreditUrl } from "@/utils/api";

interface GetCreditResponse {
  data?: { votar_credits?: number };
}

export const creditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** The user's Votar credit balance. Same request as `getCredit` in utils/api. */
    getCredit: build.query<number, string>({
      query: (userId) => ({ url: `${getCreditUrl}/${userId}` }),
      transformResponse: (response: GetCreditResponse) =>
        response?.data?.votar_credits ?? 0,
      providesTags: ["Credit"],
    }),
  }),
});

export const { useGetCreditQuery } = creditApi;
