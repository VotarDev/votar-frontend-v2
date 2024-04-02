import React from "react";

const ElectionId = () => {
  return (
    <div className="lg:my-[100px] text-center my-[50px] px-4 lg:px-0 max-w-[30rem] mx-auto lg:max-w-full">
      <div className="lg:text-2xl font-bold text-xl">
        Please enter your Access code to gain Authorization To your secret
        <br /> ballot for the Association of Political Science Analyst Election
      </div>
      <div>
        <form className="w-full flex lg:items-center lg:mt-[40px] mt-7 gap-4 flex-col lg:flex-row justify-center">
          <div>
            <input
              type="text"
              placeholder="Enter Your Access Code"
              className="border-[2px] border-[#B4B4B4] lg:w-[585px] h-[52px] outline-none p-4 rounded w-full"
            />
          </div>
          <div>
            <button className="h-[52px] bg-[#015CE9] text-white font-proximaNova rounded outline-none lg:w-[141px] w-full flex items-center justify-center">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElectionId;
