import type { AxiosInstance } from "axios";
import { baseApi } from "./baseApi";

type Tag = "Elections" | "Credit" | "User";

/**
 * Most writes still go through the old axios calls in utils/api, which don't
 * know about the RTK Query cache. These rules say which cached data a
 * successful write makes stale, so it's refetched then and only then.
 */
const RULES: [RegExp, Tag[]][] = [
  [/\/user\/create-election|\/election\/free/, ["Elections", "Credit"]],
  [
    /\/user\/(update-election|create-candidate|update-candidate|delete-candidate|delete-position|delete-election|set-voters|import-csv)/,
    ["Elections"],
  ],
  [/\/admin\/publish/, ["Elections"]],
  [/\/user\/purchase_voterCredit\/verify|\/admin\/top-up/, ["Credit"]],
  [/\/user\/(profile-update|verify-email)/, ["User"]],
];

export const invalidateOnWrite = (
  http: AxiosInstance,
  dispatch: (action: any) => unknown,
) => {
  http.interceptors.response.use((response) => {
    const { method = "get", url = "" } = response.config;
    if (method.toLowerCase() !== "get") {
      const path = url.startsWith("/") ? url : `/${url}`;
      const tags = Array.from(
        new Set(
          RULES.filter(([pattern]) => pattern.test(path)).flatMap(
            ([, ruleTags]) => ruleTags,
          ),
        ),
      );
      if (tags.length) dispatch(baseApi.util.invalidateTags(tags));
    }
    return response;
  });
};
