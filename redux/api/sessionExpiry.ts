import type { AxiosInstance } from "axios";
import Cookies from "universal-cookie";
import { baseApi } from "./baseApi";
import { logout } from "../features/auth/authSlice";
import { userData } from "../features/userProfile/userProfileSlice";
import { removeAdminData } from "../features/adminProfile/adminProfileSlice";
import {
  ADMIN_TOKEN_COOKIE,
  USER_TOKEN_COOKIE,
  clearAdminSession,
  clearUserSession,
} from "@/utils/session";

/**
 * When the API says a signed-in organiser's (or admin's) token is no longer
 * valid, end that session and send them to sign in, instead of leaving them
 * on a page where every request quietly fails.
 *
 * Only reacts when the rejected request carried that user's own token, so a
 * voter's ballot request (voter token) never signs an organiser out.
 */
export const handleSessionExpiry = (
  http: AxiosInstance,
  dispatch: (action: any) => unknown,
) => {
  let redirecting = false;

  http.interceptors.response.use(undefined, (error) => {
    if (typeof window === "undefined" || error?.response?.status !== 401) {
      return Promise.reject(error);
    }
    const sent = String(
      error.config?.headers?.Authorization ||
        error.config?.headers?.authorization ||
        "",
    );
    const cookies = new Cookies();
    const userToken = cookies.get(USER_TOKEN_COOKIE);
    const adminToken = cookies.get(ADMIN_TOKEN_COOKIE);
    const here = window.location.pathname + window.location.search;

    if (!redirecting && userToken && sent === `Bearer ${userToken}`) {
      redirecting = true;
      clearUserSession();
      dispatch(logout());
      dispatch(userData({}));
      dispatch(baseApi.util.resetApiState());
      window.location.assign(
        `/signin?expired=1&next=${encodeURIComponent(here)}`,
      );
    } else if (!redirecting && adminToken && sent === `Bearer ${adminToken}`) {
      redirecting = true;
      clearAdminSession();
      dispatch(removeAdminData());
      window.location.assign("/admin/login?expired=1");
    }
    return Promise.reject(error);
  });
};
