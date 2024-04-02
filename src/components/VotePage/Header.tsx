import React from "react";
import Header from "../BallotPage/Header";
import logo from "../../../public/assets/images/random-logo.png";
import watermark from "../../../public/assets/logos/votar.svg";

const VoteHeader = () => {
  const imgUrl =
    "https://www.bitgab.com/uploads/1610258791-beauty-pageant-1610258791.jpg";

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${imgUrl})` }}
        className="bg-cover w-full h-[40vh] flex justify-center items-center relative text-center text-white px-4"
      >
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 bottom-0 z-0"></div>
        <div className="z-10 flex flex-col gap-2">
          <div className="flex justify-center">
            <img src={logo.src} alt="logo" className="rounded-full" />
          </div>
          <div className="lg:text-3xl text-base font-semibold">
            Most Beautiful Girl In Nigeria
          </div>
          <div className="max-w-[35rem] mx-auto lg:text-base text-xs leading-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
            voluptate veritatis ea? Veniam, rem vitae?
          </div>
        </div>
        <div className="absolute lg:right-10 lg:top-10 top-2 right-2">
          <img
            src={watermark.src}
            alt="logo"
            className="lg:w-14 lg:h-14 h-10 w-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default VoteHeader;
