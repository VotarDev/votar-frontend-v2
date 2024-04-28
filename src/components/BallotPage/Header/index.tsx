import React, { useRef } from "react";
import logo from "../../../../public/assets/images/random-logo.png";
import watermark from "../../../../public/assets/logos/votar.svg";
import { IoCopy } from "react-icons/io5";
import { AiOutlineLink, AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";
import { Election } from "@/utils/types";

const Header = ({ electionDetails }: { electionDetails: Election }) => {
  const textRef = useRef<HTMLElement | null>(null);
  console.log(electionDetails);
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

  return (
    <div>
      <div className="bg-ballot-header bg-cover w-full h-[40vh] flex justify-center items-center relative text-center text-white px-4">
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 bottom-0 z-0"></div>
        <div className="z-10 flex flex-col gap-2">
          <div className="flex justify-center">
            <img
              src={electionDetails.association_logo}
              alt="logo"
              className="rounded-full w-20 h-20 "
            />
          </div>
          <div className="lg:text-3xl text-base font-semibold">
            {electionDetails.name_of_election}
          </div>
          <div className="max-w-[35rem] mx-auto lg:text-base text-xs leading-5">
            {electionDetails.description}
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
      <div className="lg:mt-10 mt-5 flex lg:justify-end items-center lg:gap-10 gap-2 flex-wrap justify-center">
        <div className="flex items-center gap-4 lg:text-xl text-base text-blue-700 font-semibold">
          <div>
            Election ID:{" "}
            <span ref={textRef}>{electionDetails.election_id}</span>
          </div>
          <div onClick={handleCopyClick} className="cursor-pointer">
            <IoCopy />
          </div>
        </div>
        <div className="flex lg:gap-7 gap-2 flex-wrap justify-center">
          <div>
            <button className="lg:w-56 w-full lg:h-14 h-10 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-xl text-xs text-blue-700 font-semibold p-4 lg:p-0">
              <span>
                <AiOutlineLink />
              </span>
              Copy Election Link
            </button>
          </div>
          <div>
            <Link href="/cast-votes" rel="noopener noreferrer" target="_blank">
              <button className="lg:w-48 lg:h-14 h-10 w-full bg-blue-700 rounded-lg border border-zinc-100 justify-center items-center gap-4 flex lg:text-xl text-xs p-4 font-semibold text-zinc-100 lg:p-0">
                <span>
                  <AiOutlineEye />
                </span>
                Preview Ballot
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
