import Cookies from "universal-cookie";
import setAuthToken from "./setAuthToken";
import { clearElectionDraft } from "./electionDraft";

export const USER_TOKEN_COOKIE = "user-token";
export const ADMIN_TOKEN_COOKIE = "admin-token";

/**
 * Only same-site paths are allowed as a post-login destination, so a crafted
 * ?next=https://evil.example link can't send someone off-site after signing in.
 */
export const safeNextPath = (next: unknown, fallback = "/dashboard") => {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  if (next.startsWith("/signin")) return fallback;
  return next;
};

/**
 * Removes everything the browser keeps for a signed-in organiser: the token
 * cookie, the API auth header, the cached user and any half-made election.
 * Redux state is reset by the caller (see signOutUser / sessionExpiry).
 */
export const clearUserSession = () => {
  const cookies = new Cookies();
  cookies.remove(USER_TOKEN_COOKIE, { path: "/" });
  setAuthToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearElectionDraft();
  }
};

/** Removes the admin token and the cached admin profile. */
export const clearAdminSession = () => {
  new Cookies().remove(ADMIN_TOKEN_COOKIE, { path: "/" });
  if (typeof window !== "undefined") localStorage.removeItem("adminData");
};
