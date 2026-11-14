import React, { useState } from "react";
import freeVotar from "../../../public/assets/images/free votar.svg";
import votarPro from "../../../public/assets/images/votar pro.svg";
import votarMeetings from "../../../public/assets/images/votar meetings.svg";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";
import Reveal from "./Reveal";
import Image from "next/image";

// Same plans, text and pictures as before (typos fixed).
const PLANS = [
  {
    name: "Free Votar",
    description: "Set up and participate in an online election or poll for free",
    image: freeVotar,
    opensVideo: true,
  },
  {
    name: "Votar Pro",
    description:
      "Enjoy more privacy and security features with Votar Pro from the comfort of your couch or on site",
    image: votarPro,
    opensVideo: false,
  },
  {
    name: "Votar Meetings",
    description:
      "Participate in motion votes, annual meeting confirmation, executive positions, Board of directors vote, By-laws amendment, budget approval, contract reformation",
    image: votarMeetings,
    opensVideo: false,
  },
];

const Election = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openVideoHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:mt-[172px] mt-[60px] max-w-[1340px] mx-auto px-4">
      <Reveal className="lg:text-5xl text-[30px] text-center font-semibold">
        <h1>Choose the Election that Suits you best</h1>
      </Reveal>
      <Reveal
        delay={0.1}
        className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 lg:mt-[62px] mt-[30px] items-stretch lg:gap-10 gap-10"
      >
        {PLANS.map((plan) => {
          const media = (
            <Image
              src={plan.image}
              alt={`${plan.name} on Votar`}
              className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          );
          return (
            // Title and text on top, photo pinned to the bottom, so the three
            // photos line up however long each description is.
            <div key={plan.name} className="flex h-full flex-col text-center">
              <div className="lg:text-[40px] text-[#015CE9] font-semibold text-2xl pb-2">
                <h2>{plan.name}</h2>
              </div>
              <p className="mx-auto max-w-[22rem] flex-1 [text-wrap:balance] lg:text-xl leading-[30px] text-base">
                {plan.description}
              </p>
              <div className="mx-auto mt-5 w-full max-w-[420px] overflow-hidden rounded-xl">
                {plan.opensVideo ? (
                  <button
                    type="button"
                    onClick={openVideoHandler}
                    aria-label={`Watch a video about ${plan.name}`}
                    className="group block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015CE9] focus-visible:ring-offset-2"
                  >
                    {media}
                  </button>
                ) : (
                  <div className="group">{media}</div>
                )}
              </div>
            </div>
          );
        })}
      </Reveal>

      {isOpen && (
        <div className="video-modal w-full h-[100vh] fixed top-0 bottom-0 left-0 flex item-center justify-center z-[999]">
          <ModalVideo
            channel="custom"
            url="/assets/videos/dummy-video.mp4"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Election;
