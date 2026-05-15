import React from "react";

import { useRouter } from "next/router";
import { useState } from "react";
import { forgotPasswordRequest } from "@/utils/api";
import { set } from "lodash";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "../../../public/assets/logos/logo_white-1.png";

const ForgotPasswordComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleCancelHandler = () => {
    router.push("/signin");
  };

  const [steps, setSteps] = useState(1);

  const handleContinueHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await forgotPasswordRequest({ email });
      if (data) {
        console.log(data);
        setIsLoading(false);
        setSteps(2);
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error);
      toast.error(error.response.data.message || error.message);

      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto">
      <div>
        <div className="w-full h-[140px] bg-blue-700 flex items-center px-10 lg:px-24 gap-6">
          <Image src={logo} width={160} alt="Votar logo" />
          <div className="w-px h-10 bg-white/30" />
          <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
        </div>
      </div>
      {steps === 1 && (
        <div className="mt-12 max-w-[700px] mx-auto">
          <h1 className="text-[24px] font-semibold">Forgot your password?</h1>
          <p className="pt-3">
            Enter the email address associated with your account, then click
            &quot;Continue&quot;.
          </p>
          <p className="pt-3">
            We will email you a link to reset your password.
          </p>
          <div className="pt-8 ">
            <h2>Email</h2>
            <div className="flex items-center gap-4 pt-2">
              <div className="">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[300px] border border-gray-300 outline-none h-12 p-4 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleContinueHandler}
                  disabled={isLoading}
                  className="w-[150px] h-12 gap-2 bg-blue-700 text-white flex items-center justify-center rounded-md outline-none"
                >
                  {isLoading && (
                    <CircularProgress size={20} style={{ color: "#ffffff" }} />
                  )}
                  Continue
                </button>

                <button
                  onClick={handleCancelHandler}
                  className="w-[150px] h-12 border border-red-500 text-red-500 flex items-center justify-center rounded-md outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {steps === 2 && (
        <div className="mt-12 max-w-[700px] mx-auto">
          <div>
            <h1 className="text-[24px] font-semibold">Check your email</h1>
            <p className="pt-3">
              If the email address you entered is associated with an account in
              our records, you will receive an email from us with instructions
              for resetting your password.
            </p>
            <p className="pt-3">
              If you do not receive this email, please check your junk mail
              folder.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordComponent;
