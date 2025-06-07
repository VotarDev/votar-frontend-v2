import React from "react";
import { PiCaretDoubleRightBold } from "react-icons/pi";
import Link from "next/link";

const JoinTeam = () => {
  return (
    <div className="my-[10rem] join-team  rounded-xl overflow-hidden">
      <div className="flex items-center justify-between lg:px-10 flex-wrap lg:flex-row flex-col-reverse ">
        <div className="text-white text-center lg:text-left my-7 lg:my-0">
          <div className="lg:text-[32px] text-[1.5rem] ">
            <h1>Excellence is our priority</h1>
          </div>
          <div className="lg:text-[20px] text-[0.875rem]">
            <p>
              Join us in creating a <br />
              sustainable future for africa
            </p>
          </div>
          <div className="mt-3 flex justify-center lg:justify-start">
            <a
              target="_blank"
              href="https://forms.gle/fZSkPPrMV2GeAp269"
              rel="noopener noreferrer"
            >
              <button className="bg-[hsla(0,0%,100%,.1)] w-[200px] h-[52px] rounded flex justify-center items-center gap-2 join-team-btn">
                Join our team{" "}
                <span>
                  <PiCaretDoubleRightBold />
                </span>
              </button>
            </a>
          </div>
        </div>
        <div>
          <img
            src="/assets/images/team.jpeg"
            className="w-[500px] h-[350px] object-cover "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
