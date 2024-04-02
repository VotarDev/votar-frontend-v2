import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  return useSelector((state: any) => state.auth.userData);
};

export const useUser = () => {
  return useSelector((state: any) => state.userProfile);
};
