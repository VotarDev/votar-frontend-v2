import React from "react";
import { PiCaretDoubleRightBold } from "react-icons/pi";

const JoinTeam = () => {
  return (
    <div className="my-[10rem] join-team  rounded-xl">
      <div className="flex items-center justify-around flex-wrap lg:flex-row flex-col-reverse">
        <div className="text-white text-center lg:text-left my-7 lg:my-0">
          <div className="lg:text-[32px] text-[1.5rem] ">
            Excellence is our priority
          </div>
          <div className="lg:text-[20px] text-[0.875rem]">
            Join us in creating a <br />
            sustainable future for africa
          </div>
          <div className="mt-3 flex justify-center lg:justify-start">
            <button className="bg-[hsla(0,0%,100%,.1)] w-[200px] h-[52px] rounded flex justify-center items-center gap-2 join-team-btn">
              Join our team{" "}
              <span>
                <PiCaretDoubleRightBold />
              </span>
            </button>
          </div>
        </div>
        <div>
          <img src="http://fpoimg.com/350x350" alt="" />
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
