import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const Navigations = ({ handleClick, currentStep, steps }: any) => {
  return (
    <div className="flex gap-4 justify-end">
      <div>
        <button
          onClick={() => handleClick()}
          className="flex items-center gap-2 p-[10px] border border-[#015CE9] rounded-lg text-[#015CE9] text-[18px] h-[52px]"
        >
          {" "}
          <span>
            <BsArrowLeft />
          </span>
          Go back
        </button>
      </div>
      <div>
        <button
          onClick={() => handleClick("next")}
          className="flex items-center gap-2 p-[10px] bg-[#015CE9] rounded-lg text-[#f3f3f3] text-[18px] h-[52px]"
        >
          Save Changes to Proceed
          <span>
            <BsArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navigations;
