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
  return (
    <div>
      <div className=" relative lg:mt-0 max-w-[1800px] mx-auto lg:h-[300px] h-auto px-4 lg:px-0">
        <div className="absolute top-0 left-0 -z-10 lg:block">
          <img src={vote.src} alt="vote" />
        </div>
        <div className="flex justify-center items-center pt-[52px] lg:absolute static left-[55%] lg:translate-x-[-50%] lg:max-w-[50%] mx-auto w-full">
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
