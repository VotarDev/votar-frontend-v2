import React from "react";
import { adminCards } from "@/utils/util";
import cardBg from "../../../../public/assets/images/card-bg.png";

const CardsSection = () => {
  return (
    <div className="rounded-lg shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] py-6 px-4 lg:py-8 lg:px-5">
      <div className="flex justify-center gap-4 lg:gap-6 lg:flex-row flex-col">
        {adminCards.map((cards) => {
          const isComingSoon =
            cards.plan === "free votar" || cards.plan === "votar meeting";

          return (
            <div
              key={cards.id}
              className={`${
                cards.plan === "free votar"
                  ? "bg-[#015CE9] opacity-25 pointer-events-none"
                  : cards.plan === "votar pro"
                  ? "bg-[#DC362E]"
                  : "bg-[#E46F24] opacity-25 pointer-events-none"
              } w-full rounded-lg text-white py-6 px-4 lg:py-7 relative z-20 overflow-hidden`}
            >
              <div className="absolute top-0 left-0 bottom-0 right-0 opacity-30 -z-10">
                <img
                  src={cardBg.src}
                  alt="card-bg"
                  className="w-full h-full object-cover"
                />
              </div>
              {isComingSoon && (
                <span className="absolute top-3 right-3 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
                  Coming Soon
                </span>
              )}
              <div>
                <div className="flex justify-between flex-wrap gap-3">
                  <div>
                    <div className="capitalize text-lg lg:text-xl">
                      {cards.plan} Elections
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold">
                      {cards.electionNumber}
                    </div>
                  </div>
                  <div>
                    <div>Votar Credits</div>
                    <div className="text-xl lg:text-2xl font-bold">
                      {cards.votarCredits}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className={`h-10 flex items-center justify-center p-2 text-base lg:text-xl rounded capitalize bg-zinc-100 mt-6 ${
                      cards.plan === "free votar"
                        ? "text-[#015CE9]"
                        : cards.plan === "votar pro"
                        ? "text-[#DC362E]"
                        : "text-[#E46F24]"
                    }`}
                  >
                    {cards.plan}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardsSection;
