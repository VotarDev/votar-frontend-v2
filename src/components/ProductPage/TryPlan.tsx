import React from "react";
import payment1 from "../../../public/assets/logos/payments.svg";
import payment2 from "../../../public/assets/logos/payments-2.svg";

const TryPlan = () => {
  return (
    <div>
      <div className="lg:my-[160px] my-[100px] px-4 lg:px-0">
        <div className="text-center lg:text-[40px] text-2xl font-semibold">
          Try our 100% free Plan
        </div>
        <div className="flex flex-wrap justify-center text-center border-[3px] rounded-lg border-[#00122F] max-w-[800px] mx-auto items-center lg:gap-6 gap-1 mt-[36px]">
          <div className="my-6 text-[#060606]">
            Get started with our free plan and make 10 lookups per month
            absolutely free!
          </div>
          <div>
            <button className="outline-none p-2 bg-[#015CE9] text-[#F3F3F3] text-xl rounded mb-6 sm:mb-0">
              Sign up
            </button>
          </div>
        </div>
        <div className="text-center mt-[30px] ">
          <div className="text-[28px] mb-3 lg-mb-0">Payment Methods</div>
          <div className="flex justify-center gap-1 flex-wrap">
            <img src={payment1.src} alt="cards" />
            <img src={payment2.src} alt="cards" />
          </div>
          <div className="mt-2">
            We accept Visa, American Express, Mastercard, Paypal and Crypto
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryPlan;
