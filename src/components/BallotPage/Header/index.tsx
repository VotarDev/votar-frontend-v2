import React, { useRef } from "react";
import watermark from "../../../../public/assets/logos/votar.svg";

import { useRouter } from "next/router";
import { Election } from "@/utils/types";
import { useSelector } from "react-redux";
import MiniDashboard from "../../VotePage/MiniDashboard";

const Header = ({
  electionDetails,
  getVoterCredit,
}: {
  electionDetails: Election | null;
  getVoterCredit?: () => void;
}) => {
  const router = useRouter();

  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  if (
    electionDetails?.type === "Free Votar" &&
    electionDetails?.elect_background_img
  )
    return (
      <div>
        <div
          style={{
            backgroundImage: electionDetails?.elect_background_img
              ? `url("${electionDetails.elect_background_img}?t=${Date.now()}")`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`w-full min-h-[45vh] md:min-h-[50vh] lg:h-[55vh] flex justify-center items-center relative text-center text-white px-4 sm:px-6 lg:px-8 ${
            !electionDetails?.elect_background_img ? "bg-ballot-header" : ""
          }`}
        >
          {/* Overlay with gradient */}
          <div className="absolute w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70 top-0 bottom-0 z-0"></div>

          {/* Content */}
          <div className="z-[5] flex flex-col gap-4 md:gap-6 max-w-5xl mx-auto py-8 md:py-12">
            <div className="flex justify-center mb-2 md:mb-4">
              <div className="relative group">
                <img
                  src={electionDetails?.association_logo}
                  alt="logo"
                  className="rounded-full w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-cover border-4 border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl -z-10"></div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight px-2">
              {electionDetails?.name_of_election}
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-white/90 px-4">
              {electionDetails?.description}
            </p>
          </div>

          {/* Watermark */}
          <div className="absolute right-4 top-4 md:right-6 md:top-6 lg:right-10 lg:top-10 z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
              <img
                src={watermark.src}
                alt="logo"
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        <div>
          {router.pathname.split("/")[1].includes("cast-votes") ||
            router.pathname.split("/")[1].includes("preview-election") ||
            (router.pathname.split("/")[1].includes("freevotar") && (
              <MiniDashboard
                election={electionDetails}
                getVotarCredit={getVoterCredit}
              />
            ))}
        </div>
      </div>
    );

  if (electionDetails?.type === "Votar Pro" || !votarPlan)
    return (
      <div className="mb-10 md:mb-16 lg:mb-20">
        <div className="relative max-w-[1600px] mx-auto lg:h-[320px] h-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-0">
          {/* SVG Background */}
          <div className="absolute top-0 left-0 right-0 w-full -z-10 lg:block overflow-hidden">
            <div className="relative">
              <svg
                viewBox="0 0 1111 294"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full w-screen h-auto object-cover"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={electionDetails?.secondary_color}
                      stopOpacity="0.9"
                    />
                    <stop
                      offset="100%"
                      stopColor={electionDetails?.secondary_color}
                      stopOpacity="1"
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={electionDetails?.primary_color}
                      stopOpacity="0.95"
                    />
                    <stop
                      offset="100%"
                      stopColor={electionDetails?.primary_color}
                      stopOpacity="1"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M223.063 253.106C118.294 327.151 -31.2577 284.047 -92.9374 253.24L-163.078 -78.7301L1071.92 -79.2535L1110.46 3.73015C977.63 -60.2136 645.496 24.0084 503.991 83.9872C366.019 150.446 262.27 225.397 223.063 253.106Z"
                  fill="url(#gradient1)"
                />
                <path
                  d="M218.063 241.106C113.294 315.151 -36.2577 272.047 -97.9374 241.24L-168.078 -90.7301L1066.92 -91.2535L1105.46 -8.26985C972.63 -72.2136 640.496 12.0084 498.991 71.9872C361.019 138.446 257.27 213.397 218.063 241.106Z"
                  fill="url(#gradient2)"
                />
              </svg>
            </div>

            {/* Vote Hand Illustration */}
            <div className="absolute bottom-0 left-4 sm:left-8 lg:left-20 hidden sm:block">
              <img
                src="/assets/images/vote-hand.svg"
                alt="vote"
                className="w-full object-cover h-16 sm:h-24 md:h-32 lg:h-40 opacity-90"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex justify-center items-center lg:absolute lg:top-[100px] static lg:left-[55%] lg:translate-x-[-55%] lg:max-w-[55%] mx-auto w-full pt-12 lg:pt-0">
            <div className="text-center space-y-4 md:space-y-6">
              {/* Logo */}
              <div className="flex justify-center">
                <div className="relative group">
                  <img
                    src={electionDetails?.association_logo}
                    alt="logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-full shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-xl -z-10"></div>
                </div>
              </div>

              {/* Election Name */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-gray-900 leading-tight px-2">
                {electionDetails?.name_of_election}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto px-4">
                {electionDetails?.description}
              </p>
            </div>
          </div>

          {/* Watermark Badge */}

          <div className="absolute right-4 top-4 md:right-6 md:top-6 lg:right-10 lg:top-10 z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
              <img
                src={watermark.src}
                alt="logo"
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain opacity-90"
              />
            </div>
            <div className="text-center mt-1">
              <code className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-gray-600 tracking-wide">
                ENCRYPTED
              </code>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Header;
