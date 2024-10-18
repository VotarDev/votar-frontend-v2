import React from "react";

const ForgotPasswordComponent = () => {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className=" p-4 bg-gray-200 h-[140px] flex items-center">
        <h1 className="text-2xl">Forgot Password</h1>
      </div>
      <div className="mt-12 max-w-[500px] mx-auto">
        <h1 className="text-[24px]">Forgot your password?</h1>
        <p className="pt-3">
          Enter the email address associated with your account, then click
          "Continue".
        </p>
        <p className="pt-3">We will email you a link to reset your password.</p>
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
              <button className="w-24 h-12 bg-blue-700 text-white flex items-center justify-center rounded-md outline-none">
                Continue
              </button>
              <button className="w-24 h-12 border border-red-500 text-red-500 flex items-center justify-center rounded-md outline-none">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
