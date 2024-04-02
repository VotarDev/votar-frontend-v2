import React from "react";
import line from "../../../public/assets/icons/line-pattern2.svg";

const OurTeam = () => {
  return (
    <div>
      <div className="lg:w-[500px] mx-auto text-center w-full mt-[3rem] lg:mt-0">
        <div className="lg:text-[40px] text-[1.5rem] text-center font-bold relative max-w-[20rem] mx-auto lg:max-w-[40rem]">
          Our <span className="text-[#015CE9]">Team</span>
          <span className="absolute lg:top-[-2rem] lg:right-[5rem] top-[-1.5rem] right-[3.5rem]">
            <img
              src={line.src}
              alt="line"
              className="w-[40px] h-[40px] object-contain lg:w-auto lg:h-auto"
            />
          </span>
        </div>
        <div className="lg:text-[18px] mt-5 text-[0.875rem]">
          Specially Skilled and committed individuals keen about ensuring a
          sustainable future for Africa make up our Team.
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-[4rem] text-center flex-wrap">
        <div>
          <img src="http://fpoimg.com/200x200" alt="" />
          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              Anthony Okon
            </div>
            <div className="text-sm">Co-founder & CEO</div>
          </div>
        </div>
        <div>
          <img src="http://fpoimg.com/200x200" alt="" />
          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              Aso Orji
            </div>
            <div className="text-sm">Co-founder & CTO</div>
          </div>
        </div>
        <div>
          <img src="http://fpoimg.com/200x200" alt="" />
          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              Tobi Faniran
            </div>
            <div className="text-sm">Engineering</div>
          </div>
        </div>
        <div>
          <img src="http://fpoimg.com/200x200" alt="" />
          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              Irene Okon
            </div>
            <div className="text-sm">Legal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
