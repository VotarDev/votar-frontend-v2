import React from "react";
import record from "../../../public/assets/icons/record.svg";
import graph from "../../../public/assets/icons/graph.svg";
import note from "../../../public/assets/icons/note.svg";
import Image from "next/image";

const Plan = () => {
  return (
    <div>
      <div className="lg:text-4xl text-2xl text-center font-bold mt-10 text-[#015CE9] px-4 lg:px-0 lg:pt-20">
        Every Plan Includes
      </div>
      <div className="flex flex-wrap justify-center text-center lg:gap-[172px] gap-10 mt-[52px]">
        <div>
          <div className="h-10 flex items-center text-[30px] font-semibold gap-2 justify-center">
            <span>
              <Image
                src={record.src}
                alt="record icon"
                height={0}
                width={0}
                style={{ width: "40px", height: "auto" }}
              />
            </span>{" "}
            Live
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            Live Updates/
            <br />
            Transimission of
            <br /> election results
          </div>
        </div>
        <div>
          <div className="h-10 flex justify-center">
            <Image
              src={graph}
              alt="graph icon"
              height={0}
              width={0}
              style={{ width: "40px", height: "auto" }}
            />
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            Analytics Tool for
            <br /> Election Result
          </div>
        </div>
        <div>
          <div className="h-10 flex justify-center">
            <Image
              src={note}
              alt="note icon"
              height={0}
              width={0}
              style={{ width: "40px", height: "auto" }}
            />
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            Branded Ballots with
            <br /> colors, Logs of
            <br /> Information set by the
            <br /> Organizers
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
