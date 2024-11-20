import React from "react";
import line from "../../../public/assets/icons/line.svg";
import line2 from "../../../public/assets/icons/line-pattern2.svg";
import { PiTarget, PiBinoculars } from "react-icons/pi";
import { IoEarth } from "react-icons/io5";

const ThePack = () => {
  return (
    <div className="my-10">
      <div className="lg:w-[500px] mx-auto text-center w-full">
        <div className="lg:text-[40px] font-bold text-[1.5rem]">
          <div className="relative max-w-[20rem] mx-auto lg:max-w-[40rem]">
            <p>
              <span className="text-[#015CE9]">What keeps</span> us going...
            </p>

            <span className="absolute lg:top-[-2rem] lg:left-[-4rem] top-[-2rem] left-[-1.5rem] hidden lg:block">
              <img src={line.src} alt="line" />
            </span>
            <span className="absolute lg:top-[-2rem] lg:right-[5rem] top-[-2rem] right-[0rem] lg:hidden">
              <img
                src={line2.src}
                alt="line"
                className="w-[40px] h-[40px] object-contain"
              />
            </span>
          </div>
        </div>
        <div className="lg:text-[18px] mt-5 text-[0.875rem]">
          <p>
            Over time. we have created an air-tight system that assures
            reliability and transparency, building a community of very satisfied
            clients and helping us accomplish our objectives.
          </p>
        </div>
      </div>
      <div className="lg:mt-[5rem] mt-[2rem] flex justify-center gap-10 flex-wrap ">
        <div className="flex lg:items-center gap-7 lg:flex-row flex-col">
          <div className="w-[70px] h-[70px] bg-[#F9F9F9] flex items-center justify-center text-[40px] text-[#015CE9] rounded-[50%] bouncing">
            <span>
              <PiTarget />
            </span>
          </div>
          <div className="  max-w-[30rem]">
            <div className="lg:text-[18px] text-base text-[#015CE9] mb-3 font-semibold">
              <h3>Our Mission</h3>
            </div>
            <div className="lg:text-base text-[0.875rem]">
              <p>
                To build an e-Voting and choice visualization infrastructure
                that
                <br />
                will revolutionize society and foster unity through
                transparency,
                <br />
                trust, and accountability across all sectors from Africa to the
                <br />
                Global landscape.
              </p>
            </div>
          </div>
        </div>

        <div className="flex lg:items-center gap-7 lg:flex-row flex-col">
          <div className="w-[70px] h-[70px] bg-[#F9F9F9] flex items-center justify-center text-[40px] text-[#015CE9] rounded-[50%] bouncing">
            <span>
              <PiBinoculars />
            </span>
          </div>
          <div className=" max-w-[30rem]">
            <div className="lg:text-[18px] text-base text-[#015CE9] mb-3 font-semibold">
              <h3>Our Vision</h3>
            </div>
            <div className="lg:text-base text-[0.875rem]">
              <p>
                To help promote trust and confidence in society, <br />
                reshaping the choice-making process one sector at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex lg:items-center gap-7 lg:flex-row flex-col">
          <div className="w-[70px] h-[70px] bg-[#F9F9F9] flex items-center justify-center text-[40px] text-[#015CE9] rounded-[50%] bouncing">
            <span>
              <IoEarth />
            </span>
          </div>
          <div className=" max-w-[30rem]">
            <div className="lg:text-[18px] text-base text-[#015CE9] mb-3 font-semibold">
              <h3>Our Culture</h3>
            </div>
            <div className="lg:text-base text-[0.875rem]">
              <p>
                We believe in serving customers&apos; needs via our
                <br /> intuitive platform, thus, creating an unparalleled
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThePack;
