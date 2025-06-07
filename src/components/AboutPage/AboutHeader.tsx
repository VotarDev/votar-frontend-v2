import React, { useEffect, useState } from "react";
import shadow from "../../../public/assets/icons/shadow-line.svg";

const AboutHeader = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < 100) {
        setCount(count + 1);
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="lg:my-[4rem] mt-[7rem]">
      <div className=" lg:text-left text-center flex items-center justify-between lg:flex-row flex-wrap flex-col">
        <div className="flex-1">
          <div className="flex justify-center lg:justify-start">
            <div className="flex bg-[#EDF0F5] lg:w-[30%] w-[80%] justify-center rounded-[50px] gap-3 items-center p-[10px] lg:justify-start text-[12px]">
              <div className="bg-[#015CE9] py-[0.75rem] px-[1rem] rounded-[20px] h-2 flex justify-center items-center text-white">
                <p>New!</p>
              </div>
              <div>
                <p>About Us!</p>
              </div>
            </div>
          </div>

          <div className="lg:text-[52px] text-[1.75rem] leading-[1.3] mt-7 font-semibold lg:max-w-[40rem]  max-w-full">
            <h1>
              Africa&apos;s leading e-Voting and choice visualization platform
            </h1>
          </div>
          <div className="lg:text-xl mt-4 text-[0.875rem]">
            <p>
              Making sure your opinion and perspective count,
              <br /> whoever you are and wherever you are is the building blocks
              of
              <br />
              our business
            </p>
          </div>
          <div className="lg:border-r-2 border-[#747474] lg:max-w-[10rem] border-none max-w-full">
            <div className="lg:text-2xl text-base font-semibold mt-5 leading-7">
              <p>{count.toLocaleString()} Million+</p>
            </div>
            <div className="text-[#747474] text-[0.75rem]">
              <p>Users processed...</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <img src="/assets/images/about-hero.jpeg" alt="about hero" />
        </div>
      </div>
      <div className="flex justify-center items-center mt-10">
        <img src={shadow.src} alt="shadow line" />
      </div>
    </div>
  );
};

export default AboutHeader;
