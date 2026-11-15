import React, { useState } from "react";
import { voterLogin } from "@/utils/api";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { voterLoginCookieName } from "@/src/__env";
import { useRouter } from "next/router";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/auth/voterLoginSlice";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import BallotStatusCard from "@/src/components/VoterBallot/BallotStatusCard";

const ALREADY_VOTED = "Please, you can only vote once. Thank you";

interface ElectionIdProps {
  electionId: string;
  electionName?: string;
}

/** The voter's access code form, which signs them in to their ballot. */
const ElectionId = ({ electionId, electionName }: ElectionIdProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [errorMesssage, setErrorMessage] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = accessCode.trim();
    if (!code) {
      setErrorMessage("Enter your access code");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const bodyData = {
        election_id: electionId,
        access_id: code,
      };
      const { data } = await voterLogin(bodyData);
      const cookie = new Cookies();
      cookie.set(voterLoginCookieName, data.data.data.token, { path: "/" });

      if (data) {
        setIsLoading(false);
        const voterData = {
          userData: data.data.data.user,
          loading: false,
          isVerified: true,
        };
        toast.success("Login Successful");

        router.push(`/ballot`);
        dispatch(login(voterData));
        localStorage.setItem("voterProfile", JSON.stringify(voterData));
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || String(error);
      toast.error(message);
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (errorMesssage.includes(ALREADY_VOTED)) {
    return (
      <BallotStatusCard
        icon={CheckCircle2}
        tone="info"
        title="You've already voted"
        description="Each voter can only vote once in this election. Thank you for taking part."
      />
    );
  }

  return (
    <div className="flex justify-center px-4 pb-16 pt-2 smm:pt-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm smm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
          <KeyRound className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-center text-xl font-bold text-foreground smm:text-2xl">
          Enter your access code
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
          Use the access code you received to open your secret ballot
          {electionName ? (
            <>
              {" "}
              for{" "}
              <span className="font-medium text-foreground">
                {electionName}
              </span>
            </>
          ) : null}
          .
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="access-code"
              className="text-sm font-medium text-foreground"
            >
              Access code
            </label>
            <Input
              id="access-code"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                if (errorMesssage) setErrorMessage("");
              }}
              placeholder="Enter your access code"
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              autoFocus
              aria-invalid={!!errorMesssage}
              aria-describedby={errorMesssage ? "access-code-error" : undefined}
              className="h-12 text-base tracking-wide"
            />
            {errorMesssage && (
              <p
                id="access-code-error"
                role="alert"
                className="text-xs font-medium text-destructive"
              >
                {errorMesssage}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full text-base"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            Open my ballot
            {!isLoading && <ArrowRight />}
          </Button>
        </form>

        <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          Your vote is secret. Can&apos;t find your code? Contact the election
          organiser.
        </p>
      </div>
    </div>
  );
};

export default ElectionId;
