import React from "react";

import { useRouter } from "next/router";
import { useState } from "react";

const ForgotPasswordComponent = () => {
  const router = useRouter();
  const handleCancelHandler = () => {
    router.push("/signin");
  };

  const [steps, setSteps] = useState(1);

  const handleContinueHandler = () => {
    setSteps(2);
  };

  return (
    <div className="max-w-[1700px] mx-auto">
      <div>
        <div className="relative w-full h-[140px]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-yellow-100 z-0"></div>

          <div className="relative z-10 flex items-center pl-[100px] h-full">
            <h1 className="text-4xl font-semibold text-black">
              Forgot password
            </h1>
          </div>
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
                  className="w-[300px] border border-gray-300 outline-none h-12 p-4 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleContinueHandler}
                  className="w-24 h-12 bg-blue-700 text-white flex items-center justify-center rounded-md outline-none"
                >
                  Continue
                </button>

                <button
                  onClick={handleCancelHandler}
                  className="w-24 h-12 border border-red-500 text-red-500 flex items-center justify-center rounded-md outline-none"
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
