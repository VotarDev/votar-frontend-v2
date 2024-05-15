import React from "react";
import vote from "../../../../public/assets/images/access-bg.svg";
import napss from "../../../../public/assets/logos/napss.svg";
import votar from "../../../../public/assets/logos/votar.svg";

type ElectionHeaderProps = {
  electionTitle: string;
  textContent?: string;
};
const ElectionHeader: React.FC<ElectionHeaderProps> = ({
  electionTitle,
  textContent,
}) => {
  const red = "#FD4D03";
  const green = "#00E337";
  return (
    <div>
      <div className=" relative lg:mt-0 max-w-[1500px] mx-auto lg:h-[300px] h-auto px-4 lg:px-0">
        <div className="absolute top-0 left-0 right-0 w-full -z-10 lg:block">
          <div className="relative">
            <svg
              viewBox="0 0 1111 294"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full w-screen h-auto object-cover"
            >
              <path
                d="M223.063 253.106C118.294 327.151 -31.2577 284.047 -92.9374 253.24L-163.078 -78.7301L1071.92 -79.2535L1110.46 3.73015C977.63 -60.2136 645.496 24.0084 503.991 83.9872C366.019 150.446 262.27 225.397 223.063 253.106Z"
                fill={`${red}`}
              />
              <path
                d="M218.063 241.106C113.294 315.151 -36.2577 272.047 -97.9374 241.24L-168.078 -90.7301L1066.92 -91.2535L1105.46 -8.26985C972.63 -72.2136 640.496 12.0084 498.991 71.9872C361.019 138.446 257.27 213.397 218.063 241.106Z"
                fill={`${green}`}
              />
            </svg>
          </div>
          <div className="absolute bottom-0 lg:left-20 left-0">
            <img
              src="/assets/images/vote-hand.svg"
              alt="vote"
              className="w-full object-cover md:h-40 h-20 "
            />
          </div>
        </div>

        <div className="flex justify-center items-center top-[110px] lg:absolute static left-[60%] lg:translate-x-[-50%] lg:max-w-[50%] mx-auto w-full">
          <div className="text-center">
            <div className="flex justify-center">
              <img src={napss.src} alt="logo" />
            </div>
            <div className="lg:text-[25px] font-semibold mt-3 text-2xl uppercase">
              {electionTitle}
            </div>
            <div className="lg:text-lg text-[#1E1E1E] leading-[30px] text-base mt-2">
              {textContent}
            </div>
          </div>
        </div>
        <div className="absolute lg:right-10 lg:top-1/2 top-2 right-2 lg:-translate-y-1/2">
          <img
            src={votar.src}
            alt="logo"
            className="lg:w-14 lg:h-14 h-10 w-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ElectionHeader;
