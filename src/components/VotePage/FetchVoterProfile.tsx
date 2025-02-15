import { useEffect } from "react";
import Cookies from "universal-cookie";

import { login, logout } from "@/redux/features/auth/voterLoginSlice";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { voterLoginCookieName } from "@/src/__env";

const FetchVoterProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const runMe = async () => {
      const cookie = new Cookies();
      const token = cookie.get(voterLoginCookieName);

      if (!token) {
        dispatch(logout());
        router.push("/vote");
        return;
      } else {
        router.push("/ballot");
      }
    };
    runMe();
  }, [dispatch]);

  return <></>;
};
export default FetchVoterProfile;
