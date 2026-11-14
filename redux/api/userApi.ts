import { baseApi } from "./baseApi";
import { usersUrl } from "@/utils/api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * The signed-in user's profile. Same request and response as `getUserData`
     * in utils/api, but cached, so moving between pages doesn't refetch it.
     */
    getUserProfile: build.query<any, string>({
      query: (userId) => ({ url: `${usersUrl}/${userId}` }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery } = userApi;
