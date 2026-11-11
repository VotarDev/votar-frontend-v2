import { baseApi } from "./baseApi";
import {
  deleteElectionUrl,
  getElectionIdUrl,
  getElectionsUrl,
} from "@/utils/api";
import type { Election, ElectionDetails } from "@/utils/types";

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
    /** One election by its election_id. Same request as `getElectionById` in utils/api. */
    getElectionById: build.query<ElectionDetails, string>({
      query: (electionId) => ({
        url: getElectionIdUrl,
        method: "POST",
        data: { election_id: electionId },
      }),
      transformResponse: (response: { data: ElectionDetails }) => response.data,
      providesTags: ["Elections"],
    }),
    /**
     * Same request as `deleteElection` in utils/api (the path takes the user
     * id; the election goes in the body). Refreshes every elections list.
     */
    deleteElection: build.mutation<
      unknown,
      { userId: string; electionId: string }
    >({
      query: ({ userId, electionId }) => ({
        url: `${deleteElectionUrl}/${userId}`,
        method: "DELETE",
        data: { election_id: electionId },
      }),
      invalidatesTags: ["Elections"],
    }),
  }),
});

export const {
  useGetElectionsQuery,
  useGetElectionByIdQuery,
  useDeleteElectionMutation,
} = electionsApi;
