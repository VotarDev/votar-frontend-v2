import React from "react";
import line from "../../../public/assets/icons/line-pattern2.svg";

const OurTeam = () => {
  return (
    <div>
      <div className="lg:w-[500px] mx-auto text-center w-full mt-[3rem] lg:mt-0">
        <div className="lg:text-[40px] text-[1.5rem] text-center font-bold relative max-w-[20rem] mx-auto lg:max-w-[40rem]">
          <h1>
            Our <span className="text-[#015CE9]">Team</span>
          </h1>
          <span className="absolute lg:top-[-2rem] lg:right-[5rem] top-[-1.5rem] right-[3.5rem]">
            <img
              src={line.src}
              alt="line"
              className="w-[40px] h-[40px] object-contain lg:w-auto lg:h-auto"
            />
          </span>
        </div>
        <div className="lg:text-[18px] mt-5 text-[0.875rem]">
          <p>
            Specially Skilled and committed individuals keen about ensuring a
            sustainable future for Africa make up our Team.
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-[4rem] text-center flex-wrap">
        <div>
          <div className="overflow-hidden w-[200px] h-[200px] rounded-full">
            <img
              src="/assets/images/anthony.jpeg"
              alt=""
              className="  object-contain"
            />
          </div>

          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              <h3>Anthony Okon</h3>
            </div>
            <div className="text-sm">
              <p>(Founding Partner & CEO)</p>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-hidden w-[200px] h-[200px] rounded-full">
            <img
              src="/assets/images/dare.jpeg"
              alt=""
              className=" object-contain"
            />
          </div>

          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              <h3>Dare Omotayo</h3>
            </div>
            <div className="text-sm">
              <p>(Founding Partner & Engineer)</p>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-hidden w-[200px] h-[200px] rounded-full">
            <img
              src="/assets/images/isreal.jpeg"
              alt=""
              className="object-contain"
            />
          </div>

          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              <h3>Israel Adwumi</h3>
            </div>
            <div className="text-sm">
              <p>(Branding and Design)</p>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-hidden w-[200px] h-[200px] rounded-full">
            <img
              src="/assets/images/tobi.jpeg"
              alt=""
              className="object-contain"
            />
          </div>

          <div className="mt-2">
            <div className="leading-[20px] font-semibold text-[18px]">
              <h3>Tobi Faniran</h3>
            </div>
            <div className="text-sm">
              <p>(Founding Partner & Engineer)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
