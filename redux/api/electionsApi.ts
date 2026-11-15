import { baseApi } from "./baseApi";
import {
  deleteElectionUrl,
  getElectionIdUrl,
  getElectionsUrl,
} from "@/utils/api";
import type { Election, ElectionDetails } from "@/utils/types";

interface GetElectionsResponse {
  // The API has returned a plain list and, now, a paginated object.
  data?:
    | Election[]
    | { elections?: Election[]; total?: number; page?: number; limit?: number };
}

export interface ElectionsPage {
  elections: Election[];
  total: number;
  page: number;
  limit: number;
}

/** Normalises either response shape into one page. */
const toPage = (response: GetElectionsResponse, page = 1): ElectionsPage => {
  const data = response?.data;
  if (Array.isArray(data)) {
    return { elections: data, total: data.length, page: 1, limit: data.length };
  }
  const elections = Array.isArray(data?.elections) ? data!.elections! : [];
  return {
    elections,
    total: data?.total ?? elections.length,
    page: data?.page ?? page,
    limit: data?.limit ?? elections.length,
  };
};

/** Elections requested per page (the server defaults to 20). */
export const ELECTIONS_PAGE_SIZE = 100;

export const electionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** One page of the user's elections, ELECTIONS_PAGE_SIZE at a time. */
    getElectionsPage: build.query<
      ElectionsPage,
      { userId: string; page: number; limit?: number }
    >({
      query: ({ userId, page, limit = ELECTIONS_PAGE_SIZE }) => ({
        url: `${getElectionsUrl}/${userId}`,
        params: { page, limit },
      }),
      transformResponse: (response: GetElectionsResponse, _meta, arg) =>
        toPage(response, arg.page),
      providesTags: ["Elections"],
    }),
    /**
     * Every election the user has created, for screens that need them all
     * (dashboard stats, the monitor and Votar Forms pickers). Fetches the
     * first page, then the rest in parallel.
     */
    getElections: build.query<Election[], string>({
      async queryFn(userId, _api, _extra, baseQuery) {
        const fetchPage = async (page: number) => {
          const result = await baseQuery({
            url: `${getElectionsUrl}/${userId}`,
            params: { page, limit: ELECTIONS_PAGE_SIZE },
          });
          if (result.error) throw result.error;
          return toPage(result.data as GetElectionsResponse, page);
        };
        try {
          const first = await fetchPage(1);
          const pageSize = first.limit || ELECTIONS_PAGE_SIZE;
          const pageCount = Math.ceil(first.total / pageSize);
          const rest = await Promise.all(
            Array.from({ length: Math.max(pageCount - 1, 0) }, (_, i) =>
              fetchPage(i + 2),
            ),
          );
          // If the server ignored the page number and sent page 1 again,
          // don't list the same elections twice.
          const seen = new Set<string>();
          const data = [first, ...rest]
            .flatMap((page) => page.elections)
            .filter((election) => {
              if (seen.has(election.election_id)) return false;
              seen.add(election.election_id);
              return true;
            });
          return { data };
        } catch (error: any) {
          return { error };
        }
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
  useGetElectionsPageQuery,
  useGetElectionByIdQuery,
  useDeleteElectionMutation,
} = electionsApi;
