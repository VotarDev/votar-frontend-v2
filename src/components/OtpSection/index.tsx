import React, { useState, useRef, useEffect } from "react";
import logo from "../../../public/assets/logos/votar-logo.svg";
import { CircularProgress } from "@mui/material";
import { useCurrentUser } from "@/utils/hooks";
import { verifyEmail } from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const OTP_LENGTH = 6;

const OtpSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const user = useCurrentUser();
  const router = useRouter();
  // Saved by sign-up, or by a sign-in that needs verifying first.
  const email: string | undefined = user?.data?.data?.email;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (success) router.push("/signin");
  }, [success, router]);

  const focusBox = (index: number) =>
    inputRefs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();

  // Digits only; typing moves on, and a pasted code fills every box.
  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setOtp((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    setOtp((prev) => {
      const next = [...prev];
      digits
        .slice(0, OTP_LENGTH - index)
        .split("")
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
      return next;
    });
    focusBox(index + digits.length);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index]) focusBox(index - 1);
    if (e.key === "ArrowLeft") focusBox(index - 1);
    if (e.key === "ArrowRight") focusBox(index + 1);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (!email) return;
    if (otpString.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    setLoading(true);
    setSuccess(false);
    try {
      const { data } = await verifyEmail({ otp: otpString, email });
      if (data) {
        // The saved sign-up details were only needed for this step; signing
        // in saves the real session.
        localStorage.removeItem("user");
        setSuccess(true);
        toast.success("Email verified successfully. You can now sign in.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "We couldn't verify that code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-screen w-full flex  justify-center px-4 bg-[#F6F6F7] overflow-auto">
        <div className="max-w-[40rem] mx-auto w-full">
          <div className="flex justify-center mb-10 mt-10">
            <img src={logo.src} alt="logo" />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-4xl leading-[1.4] pb-2 font-semibold">
              OTP verification
            </div>
            <div className="pb-8 text-slate-700">
              Please enter the OTP (One-Time Password) sent to your registered
              email/phone number to complete your verification.
            </div>
            {!email ? (
              <div className="space-y-4 text-slate-700">
                <p>
                  We couldn&apos;t find an account waiting to be verified.
                  Sign in with your email and password and we&apos;ll send you
                  a new code.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="bg-[#015CE9] text-white h-[52px] rounded-full w-full font-proximaNova"
                >
                  Go to sign in
                </button>
              </div>
            ) : (
              <form className="text-[#060606]" onSubmit={handleVerifyOtp}>
                <p className="mb-6 text-center text-sm text-slate-600">
                  Code sent to <span className="font-semibold">{email}</span>
                </p>
                <div className="flex items-center justify-center gap-2 ssm:gap-3 smm:gap-5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      aria-label={`Digit ${index + 1}`}
                      maxLength={OTP_LENGTH}
                      className="h-12 w-10 rounded border border-slate-500 text-center text-lg outline-none focus:border-[#015CE9] focus:ring-2 focus:ring-[#015CE9]/20 ssm:w-12"
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      value={digit}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-[#015CE9] text-white h-[52px] rounded-full mt-7 flex items-center justify-center gap-2 font-proximaNova w-full transition ease-out duration-150 hover:scale-[1.03] disabled:opacity-70"
                  disabled={loading}
                >
                  {loading && (
                    <CircularProgress
                      color="inherit"
                      className="ml-[-2rem]"
                      size={20}
                    />
                  )}
                  Verify
                </button>
                <p className="mt-4 text-center text-sm text-slate-600">
                  Didn&apos;t get a code? Sign in again and we&apos;ll send a
                  new one.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpSection;
