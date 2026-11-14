import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { userApi } from "@/redux/api/userApi";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import Cookies from "universal-cookie";
import PageLoader from "@/src/components/shared/PageLoader";

type ProtectedRoutesProps = {
  children: ReactNode;
  googletoken?: string;
  requireVerifiedEmail?: boolean;
};

function ProtectedRoutes({
  children,
  googletoken,
  requireVerifiedEmail = false,
}: ProtectedRoutesProps) {
  const user = useCurrentUser();
  const profile = useUser();
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [verificationError, setVerificationError] = useState("");

  const authData = user?.data?.data;
  const userId =
    user?.data?.data?.data?._id ??
    (typeof authData === "string" ? authData : authData?._id) ??
    user?.id ??
    user?.user?.id ??
    profile?.user?.id;

  useEffect(() => {
    let cancelled = false;
    const cookies = new Cookies();
    setLoading(true);
    setVerificationError("");
    setEmailVerified(null);

    const checkAuth = async () => {
      const token = cookies.get("user-token") || googletoken;

      if (!token) {
        setRedirecting(true);
        await router.push("/signin");
        return;
      }

      setAuthToken(token);

      if (requireVerifiedEmail) {
        if (!userId) {
          if (!cancelled) {
            setVerificationError(
              "We couldn't verify your email status. Please sign in again."
            );
            setLoading(false);
          }
          return;
        }

        try {
          // Shares the cached profile with the layout instead of refetching.
          const request = dispatch(
            userApi.endpoints.getUserProfile.initiate(userId),
          );
          const data = await request.unwrap().finally(request.unsubscribe);
          if (cancelled) return;

          const verified = data?.data?.email_verified === true;
          setEmailVerified(verified);

          if (!verified) {
            cookies.remove("user-token", { path: "/" });
            setAuthToken(null);
          }
        } catch (_error) {
          if (!cancelled) {
            setVerificationError(
              "We couldn't verify your email status. Please sign in again."
            );
          }
        }
      }

      if (!cancelled) setLoading(false);
    };

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, [googletoken, requireVerifiedEmail, router, userId, dispatch]);

  const returnToSignIn = () => {
    window.location.href = "/signin";
  };

  if (loading || redirecting) {
    return <PageLoader message={redirecting ? "Taking you to sign in" : undefined} />;
  }

  if (verificationError || emailVerified === false) {
    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <p>
          {verificationError ||
            "Verify your email before creating an election. Sign in to receive a new verification code."}
        </p>
        <button
          type="button"
          onClick={returnToSignIn}
          className="rounded bg-[#015CE9] px-5 py-3 text-white"
        >
          Sign in to verify email
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoutes;
