import React from "react";
import vote from "../../../public/assets/images/access-bg.svg";
import napss from "../../../public/assets/logos/napss.svg";
import votar from "../../../public/assets/logos/votar.svg";

const Header = () => {
  return (
    <div>
      <div className=" relative lg:mt-0 max-w-[1800px] mx-auto lg:h-[300px] h-auto px-4 lg:px-0">
        <div className="absolute top-0 left-0 -z-10 lg:block">
          <img src={vote.src} alt="vote" />
        </div>
        <div className="flex justify-center items-center pt-[52px] lg:absolute static left-[52%] lg:translate-x-[-50%] lg:max-w-[50%] mx-auto w-full">
          <div className="text-center">
            <div className="flex justify-center">
              <img src={napss.src} alt="logo" />
            </div>
            <div className="lg:text-[32px] font-semibold mt-3 text-2xl">
              NATIONAL ASSOCIATION OF POLITICAL
              <br /> SCIENCE ANALYST
            </div>
            <div className="lg:text-xl text-[#1E1E1E] leading-[30px] text-base mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius
              <br /> consectetur viverra nullam dictumst aliquet purus vel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
