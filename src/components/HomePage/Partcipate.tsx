import React from "react";
import Reveal from "./Reveal";
import people from "../../../public/assets/icons/people.svg";
import { LiaSmsSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import Image from "next/image";

// Same channels and text as before.
const CHANNELS = [
  {
    title: "On-Site Voting",
    text: "Participate in your election physically at the polling units with the Votar platform on your devices",
    icon: <Image src={people} alt="" className="h-[50px] w-auto" />,
  },
  {
    title: "Email",
    text: "Voters receive all information on how to access their secret ballot and participate in an election via email",
    icon: <TfiEmail className="text-[50px]" aria-hidden="true" />,
  },
  {
    title: "SMS",
    text: "Voters receive all information on how to access their secret ballot and participate in an election via SMS",
    icon: <LiaSmsSolid className="text-[50px]" aria-hidden="true" />,
  },
];

const Partcipate = () => {
  return (
    <div className="max-w-[1340px] mx-auto lg:mt-24 mt-14 px-4">
      <Reveal className="mx-auto max-w-4xl lg:text-5xl text-[30px] text-center font-semibold [text-wrap:balance]">
        <h2 className="lg:leading-[1.2]">
          Participate and Receive Notifications, Information and Results via:
        </h2>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-[#F5F5F5] sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:mt-12 mt-8"
      >
        {CHANNELS.map((channel) => (
          <div
            key={channel.title}
            className="mx-auto w-full max-w-[360px] rounded-lg bg-[#015CE9] p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex h-[50px] items-center">{channel.icon}</div>
            <h3 className="lg:text-[32px] text-2xl mt-4">{channel.title}</h3>
            <p className="lg:text-xl mt-3 text-base">{channel.text}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
};

export default Partcipate;
