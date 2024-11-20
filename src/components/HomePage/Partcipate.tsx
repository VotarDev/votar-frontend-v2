import React from "react";
import people from "../../../public/assets/icons/people.svg";
import { LiaSmsSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import Image from "next/image";

const Partcipate = () => {
  return (
    <div className="max-w-[1340px] mx-auto lg:mt-[100px] px-4 mt-[60px]">
      <div className="lg:text-5xl text-[30px] text-center font-semibold">
        <h1>
          Participate and Recieve Notifications, Information and
          <br /> Results via:
        </h1>
      </div>

      <div className="flex justify-center items-stretch flex-wrap text-[#F5F5F5] lg:gap-[85px] gap-10 lg:mt-[117px] mt-[40px]">
        <div className="bg-[#015CE9] rounded-lg p-6 w-[293px] ">
          <div>
            <Image src={people} alt="icons" />
          </div>
          <div className="lg:text-[32px] text-2xl mt-[15px]">
            <h2>On-Site Voting</h2>
          </div>
          <div className="lg:text-xl mt-[17px] text-base">
            <p>
              Participate in your election physically at the polling units with
              the Votar platform on your devices
            </p>
          </div>
        </div>
        <div className="bg-[#015CE9] rounded-lg p-6 w-[293px]">
          <div>
            <TfiEmail className="text-[50px]" />
          </div>
          <div className="lg:text-[32px] text-2xl mt-[15px]">
            <h2>Email</h2>
          </div>
          <div className="lg:text-xl mt-[17px] text-base">
            <p>
              Voters receive all information on how to access their secret
              ballot and participate in an election via email
            </p>
          </div>
        </div>
        <div className="bg-[#015CE9] rounded-lg p-6 w-[293px]">
          <div>
            <LiaSmsSolid className="text-[50px]" />
          </div>
          <div className="lg:text-[32px] text-2xl mt-[15px]">
            <h2>SMS</h2>
          </div>
          <div className="lg:text-xl mt-[17px] text-base">
            <p>
              Voters receive all information on how to access their secret
              ballot and participate in an election via SMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partcipate;
