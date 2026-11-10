import { baseApi } from "./baseApi";
import { getElectionsUrl } from "@/utils/api";
import type { Election } from "@/utils/types";

interface GetElectionsResponse {
  // The API has returned both shapes; existing screens accept either.
  data?: Election[] | { elections?: Election[] };
}

export const electionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Elections created by the user. Same request as `getElections` in utils/api. */
    getElections: build.query<Election[], string>({
      query: (userId) => ({ url: `${getElectionsUrl}/${userId}` }),
      transformResponse: (response: GetElectionsResponse) => {
        const data = response?.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.elections)) return data.elections;
        return [];
      },
      providesTags: ["Elections"],
    }),
  }),
});

export const { useGetElectionsQuery } = electionsApi;
