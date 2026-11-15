import { CircularProgress, TextField } from "@mui/material";

import React, { useState, useEffect } from "react";
import logo from "../../public/assets/logos/logo_white-1.png";
import illustration from "../../public/assets/illustrations/illustration-4.svg";
import { useRouter } from "next/router";
import { verifyForgotPasswordRequest } from "@/utils/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchUser, setIsFetchUser] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [user, setUser] = useState("");
  const router = useRouter();
  const { t } = router.query;

  // The rules listed on the page.
  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must have at least 8 characters.";
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return "Password must have upper and lowercase letters.";
    }
    if (!/\d/.test(password)) return "Password must include at least one number.";
    const name = typeof user === "string" ? user.trim().toLowerCase() : "";
    const personal = name.split(/\s+/).filter((part) => part.length >= 3);
    if (personal.some((part) => password.toLowerCase().includes(part))) {
      return "Password must not contain your name.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      if (t) {
        const { data } = await verifyForgotPasswordRequest({
          token: t as string,
          password: newPassword,
        });
        if (data) {
          router.push("/signin");
          toast.success("Password reset successful");
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && !t) {
      setLinkError("This reset link is incomplete.");
    }
  }, [router.isReady, t]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetchUser(true);
      try {
        if (t) {
          const { data } = await verifyForgotPasswordRequest({
            token: t as string,
          });
          if (data) {
            setUser(data.data);
            setIsFetchUser(false);
          }
        }
      } catch (error: any) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLinkError(message);
        setIsFetchUser(false);
      }
    };
    fetchUser();
  }, [t]);

  if (isFetchUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={20} style={{ color: "#2B77ED" }} />
      </div>
    );
  }

  if (linkError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-foreground">
            This reset link can&apos;t be used
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {linkError} Reset links expire and can only be used once. Request a
            new one and use the latest email.
          </p>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="mt-6 h-12 w-full rounded bg-[#015CE9] font-semibold text-white"
          >
            Request a new link
          </button>
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="mt-2 h-11 w-full rounded font-medium text-[#015CE9]"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="hidden bg-auth-bg w-[40%] min-h-[100vh] bg-cover bg-left-bottom bg-no-repeat bg-[#2B77ED] lg:flex  flex-col justify-center py-10">
        <div className="mt-[-6rem] ml-[-3rem]">
          <img src={logo.src} alt="logo" />
        </div>
        <div className="mt-[0rem] text-center">
          <div className="flex justify-center">
            <img src={illustration.src} alt="illustration" />
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col lg:my-0 my-8 lg:py-0 w-full mx-auto lg:max-w-[500px] px-4">
        <div>
          <h1 className="text-xl sm:text-2xl capitalize break-words">Hello, {user || "*"}!</h1>
          <p className="pt-3">
            Please set up your new credentials in order to log in.
            <br />
            Your new password must:
          </p>
        </div>

        <ul className="list-disc pl-5 pt-3">
          <li>Have at least 8 characters</li>
          <li>Have upper and lowercase letters, and at least one number</li>
          <li>Not contain any of your personal information</li>
        </ul>
        <form className="w-full text-[#060606] mt-10" onSubmit={handleSubmit}>
          <div className="flex justify-center w-full gap-5 sm:flex-row flex-col">
            <div className="flex-1">
              <TextField
                variant="standard"
                label="New password"
                className="w-full"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                InputLabelProps={{
                  style: {
                    color: "#bfbfbf",
                  },
                }}
              />
            </div>
            <div className="flex-1">
              <TextField
                variant="standard"
                label="Confirm password"
                className="w-full"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                  style: {
                    color: "#bfbfbf",
                  },
                }}
              />
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center mt-3">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className=" bg-[#015CE9] text-white h-[52px] rounded mt-7 w-full font-proximaNova flex justify-center items-center gap-3"
          >
            {isLoading && (
              <CircularProgress size={20} style={{ color: "#ffffff" }} />
            )}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
