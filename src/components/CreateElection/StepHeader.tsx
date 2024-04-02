import React, { useState, useEffect, useRef } from "react";
import { PiCaretRightBold } from "react-icons/pi";

const StepHeader = ({ steps, currentStep }: any) => {
  const [newStep, setNewStep] = useState([]);

  useEffect(() => {
    setNewStep(steps);
  }, [steps, currentStep]);

  return (
    <div className="flex items-center lg:gap-5 gap-2 font-semibold lg:text-xl flex-wrap text-base">
      {newStep.map((step: string, index: number) => (
        <div
          key={index}
          className={`${
            index + 1 == currentStep ? "text-[#015CE9]" : "text-[#1E1E1E]"
          }`}
        >
          <div className="flex items-center gap-2 plan-header">
            {step}{" "}
            <span>{index !== steps.length - 1 && <PiCaretRightBold />}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepHeader;
