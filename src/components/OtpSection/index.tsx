import React, { useState, useRef, useEffect } from "react";
import logo from "../../../public/assets/logos/votar-logo.svg";
import { CircularProgress } from "@mui/material";
import { useCurrentUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { verifyEmail } from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

let currentOTPIndex: number = 0;

const OtpSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(new Array(7).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useCurrentUser();
  const router = useRouter();

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    if (success) router.push("/signin");
  }, [success, router]);

  const handleVerifyOtp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if (user) setAuthToken(user.data ? user.data.data.cookie : null);
    setLoading(true);
    setSuccess(false);
    const otpString = otp.join("");
    try {
      const { data } = await verifyEmail({
        otp: otpString,
        email: user.data.data.email,
      });
      setSuccess(true);
      toast.success("Email verified successfully");
      console.log(data);
    } catch (error: any) {
      toast.error(error.response.data.message);
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
            <form className=" text-[#060606]">
              <div className="flex items-center gap-5 justify-center">
                {otp.map((_, index) => {
                  return (
                    <React.Fragment key={index}>
                      <input
                        ref={activeOTPIndex === index ? inputRef : null}
                        type="number"
                        className={
                          "w-12 h-12 rounded border border-slate-500 outline-none text-center"
                        }
                        onChange={handleOnChange}
                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                        value={otp[index]}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              <button
                onClick={handleVerifyOtp}
                className="bg-[#015CE9] text-white h-[52px] rounded-full mt-7 flex items-center justify-center gap-2 font-proximaNova w-full transition ease-out duration-150 hover:scale-[1.03]"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpSection;
