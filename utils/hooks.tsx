import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  return useSelector((state: any) => state.auth.userData);
};

export const useUser = () => {
  return useSelector((state: any) => state.userProfile);
};

/**
 * The signed-in user's id. Email sign-in stores the user under `data.data`,
 * Google sign-in stores it flat with `id`; the profile is the last fallback.
 * Same lookup as the `USER_ID` expression used across the pages.
 */
export const useCurrentUserId = (): string | undefined => {
  const users = useCurrentUser();
  const user = useUser();
  return users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;
};
