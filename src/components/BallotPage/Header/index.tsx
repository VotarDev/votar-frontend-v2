import React, { useRef } from "react";
import logo from "../../../../public/assets/images/random-logo.png";
import watermark from "../../../../public/assets/logos/votar.svg";
import { IoCopy } from "react-icons/io5";
import { AiOutlineLink, AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Election } from "@/utils/types";
import { useSelector } from "react-redux";
import MiniDashboard from "../../VotePage/MiniDashboard";

const Header = ({ electionDetails }: { electionDetails: Election | null }) => {
  const textRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  const handleCopyClick = async () => {
    if (textRef.current) {
      const selectedText = textRef.current.innerText;
      try {
        await navigator.clipboard.writeText(selectedText);

        toast.success("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };

  if (electionDetails?.type === "Free Votar")
    return (
      <div>
        <div
          style={{
            backgroundImage: electionDetails?.elect_background_img
              ? `url("${
                  electionDetails.elect_background_img
                }?t=${new Date().getTime()}")`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`w-full h-[40vh] flex justify-center items-center relative text-center text-white px-4 ${
            !electionDetails?.elect_background_img ? "bg-ballot-header" : ""
          }`}
        >
          <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 bottom-0 z-0"></div>
          <div className="z-10 flex flex-col gap-2">
            <div className="flex justify-center">
              <img
                src={electionDetails?.association_logo}
                alt="logo"
                className="rounded-full w-20 h-20 "
              />
            </div>
            <div className="lg:text-3xl text-base font-semibold">
              {electionDetails?.name_of_election}
            </div>
            <div className="max-w-[35rem] mx-auto lg:text-base text-xs leading-5">
              {electionDetails?.description}
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

        <div>
          {router.pathname.split("/")[1].includes("cast-votes") ||
            router.pathname.split("/")[1].includes("preview-election") ||
            (router.pathname.split("/")[1].includes("freevotar") && (
              <MiniDashboard />
            ))}
        </div>
      </div>
    );

  if (electionDetails?.type === "Votar Pro" || !votarPlan)
    return (
      <div className="mb-10">
        <div className=" relative lg:mt-0 max-w-[1600px] mx-auto lg:h-[300px] h-auto px-4 lg:px-0">
          <div className="absolute top-0 left-0 right-0 w-full -z-10 lg:block">
            <div className="relative">
              <svg
                viewBox="0 0 1111 294"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full w-screen h-auto object-cover"
              >
                <path
                  d="M223.063 253.106C118.294 327.151 -31.2577 284.047 -92.9374 253.24L-163.078 -78.7301L1071.92 -79.2535L1110.46 3.73015C977.63 -60.2136 645.496 24.0084 503.991 83.9872C366.019 150.446 262.27 225.397 223.063 253.106Z"
                  fill={`${electionDetails?.secondary_color}`}
                />
                <path
                  d="M218.063 241.106C113.294 315.151 -36.2577 272.047 -97.9374 241.24L-168.078 -90.7301L1066.92 -91.2535L1105.46 -8.26985C972.63 -72.2136 640.496 12.0084 498.991 71.9872C361.019 138.446 257.27 213.397 218.063 241.106Z"
                  fill={`${electionDetails?.primary_color}`}
                />
              </svg>
            </div>
            <div className="absolute bottom-0 lg:left-20 left-0">
              <img
                src="/assets/images/vote-hand.svg"
                alt="vote"
                className="w-full object-cover md:h-40 h-20 "
              />
            </div>
          </div>

          <div className="flex justify-center items-center top-[100px] lg:absolute static left-[55%] lg:translate-x-[-55%] lg:max-w-[50%] mx-auto w-full">
            <div className="text-center">
              <div className="flex justify-center mt-10 lg:mt-0">
                <img
                  src={electionDetails?.association_logo}
                  alt="logo"
                  className="lg:w-32 lg:h-32 object-cover w-[100px] h-[100px] rounded-full"
                />
              </div>
              <div className="lg:text-[25px] font-semibold mt-3 text-2xl uppercase">
                {electionDetails?.name_of_election}
              </div>
              <div className="lg:text-lg text-[#1E1E1E] leading-[30px] text-base mt-2">
                {electionDetails?.description}
              </div>
            </div>
          </div>
          <div className="absolute lg:right-10 lg:top-1/2 top-2 right-2 lg:-translate-y-1/2">
            <img
              src={watermark.src}
              alt="logo"
              className="lg:w-14 lg:h-14 h-10 w-10 object-contain"
            />
            <div className="-mt-1">
              <code className="text-[11px] ">Encrypted</code>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Header;
